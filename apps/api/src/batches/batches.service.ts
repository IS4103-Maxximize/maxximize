import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BinsService } from '../bins/bins.service';
import { UpdateBinDto } from '../bins/dto/update-bin.dto';
import { GrLineItem } from '../gr-line-items/entities/gr-line-item.entity';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { ProductionOrdersService } from '../production-orders/production-orders.service';
import { PurchaseRequisition } from '../purchase-requisitions/entities/purchase-requisition.entity';
import { PurchaseRequisitionsService } from '../purchase-requisitions/purchase-requisitions.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { WarehousesService } from '../warehouses/warehouses.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';

@Injectable()
export class BatchesService {
  constructor(@InjectRepository(Batch)
  private readonly batchRepository: Repository<Batch>,
  private warehouseService: WarehousesService,
  private binService: BinsService,
  private salesInquiryService: SalesInquiryService,
  private purchaseRequisitionService: PurchaseRequisitionsService,
  private productionOrderService: ProductionOrdersService,
  private dataSource: DataSource) {}

  async create(createBatchDto: CreateBatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batch = new Batch();
      batch.batchNumber = createBatchDto.batchNumber;
      batch.batchLineItems = createBatchDto.batchLineItems;
      const createdBatch = await queryRunner.manager.save(batch);
      await queryRunner.commitTransaction();
      return createdBatch;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createWithExistingTransaction(createBatchDto: CreateBatchDto, goodsReceiptLineItems: GrLineItem[], 
    salesInquiryId: number, orgId: number, queryRunner: QueryRunner) {
    const batch = new Batch();
    batch.batchNumber = createBatchDto.batchNumber;
    batch.organisationId = createBatchDto.organisationId;

    const bins = await this.binService.findAllByOrganisationId(orgId);
    const batchLineItems: BatchLineItem[] = [];
    
    // Duplicate goodsReceiptLineItems
    const unassigned = goodsReceiptLineItems.slice();

    // Try to allocate those line items fully
    for (const lineItem of goodsReceiptLineItems) {
      for (const bin of bins) {
        const lineItemCapacity = lineItem.quantity;
        if (lineItemCapacity <= bin.capacity - bin.currentCapacity) {
          const batchLineItem = new BatchLineItem();
          batchLineItem.bin = bin;
          batchLineItem.product = lineItem.product;
          batchLineItem.quantity = lineItem.quantity;
          batchLineItem.subTotal = lineItem.product.unitPrice * lineItem.quantity;
          const date = new Date();
          date.setDate(date.getDate() + lineItem.product.expiry);
          batchLineItem.expiryDate = date;
          batchLineItems.push(batchLineItem);
          bin.currentCapacity = bin.currentCapacity + lineItemCapacity;
          const index = unassigned.indexOf(lineItem);
          unassigned.splice(index, 1);
          break;
        }
      }
    }

    // For those that cannot be allocated fully, find bins with space
    // and allocate partially till all of the product is allocated
    for (const unallocated of unassigned) {
      let qty = unallocated.quantity;
      while (qty > 0) { // can remove, no need this qty > 0 
        for (const bin of bins) {
          const availableSpace = bin.capacity - bin.currentCapacity;
          if (availableSpace > 0) {
            const batchLineItem = new BatchLineItem();
            if (qty > availableSpace) {
              batchLineItem.quantity =  availableSpace;
              bin.currentCapacity = bin.capacity;
            } else {
              batchLineItem.quantity =  qty;
              bin.currentCapacity = bin.currentCapacity + qty;
            }
            batchLineItem.bin = bin;
            batchLineItem.product = unallocated.product;
            batchLineItem.subTotal = unallocated.product.unitPrice * batchLineItem.quantity;
            
            batchLineItems.push(batchLineItem);

            qty -= availableSpace;
          }
          if (qty < 0) {
            break;
          }
        }
      }
    }

    for (const bin of bins) {
      const updateBinDto = new UpdateBinDto();
      updateBinDto.currentCapacity = bin.currentCapacity;
      await this.binService.update(bin.id, updateBinDto);
    }

    batch.batchLineItems = batchLineItems;

    const createdBatch = await queryRunner.manager.save(batch);

    const salesInquiry = await this.salesInquiryService.findOne(salesInquiryId);
    const purchaseReqs: PurchaseRequisition[] = salesInquiry.purchaseRequisitions;  

    const rawMaterialPurchaseReqMap = new Map<number, PurchaseRequisition[]>();
    const rawMaterialsStock = new Map<number, BatchLineItem[]>();

    if (purchaseReqs != undefined || purchaseReqs != null || purchaseReqs.length != 0) {
      // Collate batch line items according to raw material
      for (const batchLineItem of batchLineItems) {
        const product = batchLineItem.product;
        if (product instanceof RawMaterial) {
          const lineItems = rawMaterialsStock.get(product.id);
          if (lineItems === undefined) {
            const lineItemsArr: BatchLineItem[] = [];
            lineItemsArr.push(batchLineItem);
            rawMaterialsStock.set(product.id, lineItemsArr);
          } else {
            lineItems.push(batchLineItem);
            rawMaterialsStock.set(product.id, lineItems);
          }
        }
      }

      // Collate purchase requisitions according to raw material
      for (const purchaseReq of purchaseReqs) {
        if (rawMaterialPurchaseReqMap.has(purchaseReq.rawMaterialId)) {
          const purchaseReqArr = rawMaterialPurchaseReqMap.get(purchaseReq.rawMaterialId);
          purchaseReqArr.push(purchaseReq);
          rawMaterialPurchaseReqMap.set(purchaseReq.rawMaterialId, purchaseReqArr);
        } else {
          const arr: PurchaseRequisition[] = [];
          arr.push(purchaseReq);
          rawMaterialPurchaseReqMap.set(purchaseReq.rawMaterialId, arr);
        }
      }
    }

    // Update product requisitions and allocate batch line items to production line items
    for (const grLineItem of goodsReceiptLineItems) {
      if (rawMaterialPurchaseReqMap.has(grLineItem.product.id)) {
        const arr = rawMaterialPurchaseReqMap.get(grLineItem.product.id);
        const totalQtyReq = arr.reduce((seed, pr) => {
          return seed + pr.expectedQuantity
        }, 0);
        if (grLineItem.quantity >= totalQtyReq) {
          for (const purchaseReq of arr) {
            const pr = await this.purchaseRequisitionService.updateFulfilledQtyQueryRunner(purchaseReq, 0, queryRunner);
            const batchLineItems = rawMaterialsStock.get(purchaseReq.rawMaterial.id);
            for (const batchLine of batchLineItems) {
              if (batchLine.quantity - batchLine.reservedQuantity == 0) {
                continue;
              }
              const productionOrder = await queryRunner.manager.findOne(ProductionOrder, {
                where: {
                  id: purchaseReq.productionLineItem.productionOrder.id
                },
                relations: ["prodLineItems"]
              });
              const productionLineItem = new ProductionLineItem();
              productionLineItem.purchaseRequisition = pr;
              productionLineItem.rawMaterial = purchaseReq.rawMaterial;
              productionLineItem.sufficient = true;

              if (batchLine.quantity - batchLine.reservedQuantity > purchaseReq.quantityToFulfill) {
                productionLineItem.quantity = purchaseReq.quantityToFulfill;
                batchLine.reservedQuantity += purchaseReq.quantityToFulfill;
              } else {
                productionLineItem.quantity = batchLine.quantity - batchLine.reservedQuantity;
                batchLine.reservedQuantity += (batchLine.quantity - batchLine.reservedQuantity);
              }
              productionLineItem.batchLineItem = await queryRunner.manager.save(batchLine);;
              const prodLine = await queryRunner.manager.save(productionLineItem);
              productionOrder.prodLineItems.push(prodLine);
              await queryRunner.manager.save(productionOrder);

            } 
            purchaseReq.quantityToFulfill = 0;
          }
        } else {
          arr.sort((pr1, pr2) => pr1.createdDateTime.getTime() - pr2.createdDateTime.getTime());
          for (const purchaseReq of arr) {
            const batchLineItems = rawMaterialsStock.get(purchaseReq.rawMaterial.id);
            for (const batchLine of batchLineItems) {
              if (batchLine.quantity - batchLine.reservedQuantity == 0) {
                continue;
              }
              if (purchaseReq.productionLineItem) {
                const productionOrder = await queryRunner.manager.findOne(ProductionOrder, {
                  where: {
                    id: purchaseReq.productionLineItem.productionOrder.id
                  },
                  relations: ["prodLineItems"]
                });
                const productionLineItem = new ProductionLineItem();
                productionLineItem.rawMaterial = purchaseReq.rawMaterial;
                productionLineItem.sufficient = true;
                if (batchLine.quantity - batchLine.reservedQuantity > purchaseReq.quantityToFulfill) {
                  productionLineItem.quantity = purchaseReq.quantityToFulfill;
                  batchLine.reservedQuantity += purchaseReq.quantityToFulfill;
                  await this.purchaseRequisitionService.updateFulfilledQtyQueryRunner(purchaseReq, 0, queryRunner);
                  purchaseReq.quantityToFulfill = 0;
                } else {
                  await this.purchaseRequisitionService.updateFulfilledQtyQueryRunner(purchaseReq, purchaseReq.quantityToFulfill - (batchLine.quantity - batchLine.reservedQuantity), queryRunner);
                  productionLineItem.quantity = batchLine.quantity - batchLine.reservedQuantity;
                  batchLine.reservedQuantity += (batchLine.quantity - batchLine.reservedQuantity);
                  purchaseReq.quantityToFulfill -= batchLine.quantity - batchLine.reservedQuantity;
                }
                productionLineItem.batchLineItem = batchLine;
                queryRunner.manager.save(batchLine);
                const prodLine = await queryRunner.manager.save(productionLineItem);
                productionOrder.prodLineItems.push(prodLine);
                queryRunner.manager.save(productionOrder);
              }
            }
          }
        }
      }
    }
    return createdBatch;
  }

  async findAll() {
    return await this.batchRepository.find({
      relations: ["batchLineItems", "goodsReceipt"]
    });
  }

  async findOne(id: number) {
    return await this.batchRepository.findOne({
      where: { id },
      relations: ["batchLineItems", "goodsReceipt"]
    });
  }

  async findAllByOrganisationId(id: number) {
    return await this.batchRepository.find({
      where: {
        organisationId: id
      },
      relations: ["batchLineItems", "goodsReceipt"]
    });
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const batch = await this.findOne(id);
      batch.goodsReceipt = updateBatchDto.goodsReceipt;
      batch.batchLineItems = updateBatchDto.batchLineItems;
      await queryRunner.manager.update(Batch, id, updateBatchDto);
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.batchRepository.delete(id);
  }

  async allocate(orgId: number, lineItem) {
    const batch = new Batch();
    batch.batchNumber = 'B-' + randomUUID().substring(0, 5) + '-' + new Date().toLocaleDateString().replace(/\//g, '-') +
      '-' + new Date().toLocaleTimeString();
    batch.organisationId = orgId;

    const bins = await this.binService.findAllByOrganisationId(orgId);
    const batchLineItems: BatchLineItem[] = [];
    
    for (const bin of bins) {
      const lineItemCapacity = lineItem.quantity;
      if (lineItemCapacity <= bin.capacity - bin.currentCapacity) {
        const batchLineItem = new BatchLineItem();
        batchLineItem.bin = bin;
        batchLineItem.product = lineItem.product;
        batchLineItem.quantity = lineItem.quantity;
        batchLineItem.subTotal = lineItem.product.unitPrice * lineItem.quantity;
        const date = new Date();
        date.setDate(date.getDate() + lineItem.product.expiry);
        batchLineItem.expiryDate = date;
        batchLineItems.push(batchLineItem);
        bin.currentCapacity = bin.currentCapacity + lineItemCapacity;
        break;
      }
    }

    let qty = lineItem.quantity;
    for (const bin of bins) {
      const availableSpace = bin.capacity - bin.currentCapacity;
      if (availableSpace > 0) {
        const batchLineItem = new BatchLineItem();
        if (qty > availableSpace) {
          batchLineItem.quantity =  availableSpace;
          bin.currentCapacity = bin.capacity;
        } else {
          batchLineItem.quantity =  qty;
          bin.currentCapacity = bin.currentCapacity + qty;
        }
        batchLineItem.bin = bin;
        batchLineItem.product = lineItem.product;
        batchLineItem.subTotal = lineItem.product.unitPrice * batchLineItem.quantity;
        
        batchLineItems.push(batchLineItem);

        qty -= availableSpace;
      }
      if (qty < 0) {
        break;
      }
    }
    if (qty > 0) {
      throw new InternalServerErrorException("Could not allocate to bins");
    }

    for (const bin of bins) {
      const updateBinDto = new UpdateBinDto();
      updateBinDto.currentCapacity = bin.currentCapacity;
      await this.binService.update(bin.id, updateBinDto);
    }

    batch.batchLineItems = batchLineItems;

    return batch;
  }
}
