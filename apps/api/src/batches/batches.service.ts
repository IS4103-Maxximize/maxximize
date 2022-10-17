import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BinsService } from '../bins/bins.service';
import { UpdateBinDto } from '../bins/dto/update-bin.dto';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { GrLineItem } from '../gr-line-items/entities/gr-line-item.entity';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { PurchaseRequisition } from '../purchase-requisitions/entities/purchase-requisition.entity';
import { PurchaseRequisitionsService } from '../purchase-requisitions/purchase-requisitions.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';

@Injectable()
export class BatchesService {
  constructor(@InjectRepository(Batch)
  private readonly batchRepository: Repository<Batch>,
  private binService: BinsService,
  private salesInquiryService: SalesInquiryService,
  private purchaseRequisitionService: PurchaseRequisitionsService,
  private finalGoodService: FinalGoodsService,
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
        const lineItemCapacity = lineItem.quantity * lineItem.unitOfVolumetricSpace;
        if (lineItemCapacity <= bin.volumetricSpace - bin.currentCapacity) {
          const batchLineItem = new BatchLineItem();
          batchLineItem.code = "B-" + bin.name + "-R-" + bin.rack.name + "-W-" + bin.rack.warehouse.name;
          batchLineItem.bin = bin;
          batchLineItem.product = lineItem.product;
          batchLineItem.quantity = lineItem.quantity;
          batchLineItem.unitOfVolumetricSpace = lineItem.unitOfVolumetricSpace;
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

    const cannotBeAllocated = unassigned.slice();

    // For those that cannot be allocated fully, find bins with space on first fit basis
    // and allocate partially till all of the product is allocated
    for (const unallocated of unassigned) {
      let qty = unallocated.quantity;
      for (const bin of bins) {
        const availableSpace = bin.volumetricSpace - bin.currentCapacity;
        const spaceRequired = qty * unallocated.unitOfVolumetricSpace;
        if (availableSpace > 0) {
          const batchLineItem = new BatchLineItem();
          if (spaceRequired > availableSpace) {
            batchLineItem.quantity =  Math.floor(availableSpace / unallocated.unitOfVolumetricSpace);
            bin.currentCapacity = bin.currentCapacity + (batchLineItem.quantity * unallocated.unitOfVolumetricSpace);
          } else {
            batchLineItem.quantity =  unallocated.quantity;
            bin.currentCapacity = bin.currentCapacity + spaceRequired;
          }
          batchLineItem.code = "B-" + bin.name + "-R-" + bin.rack.name + "-W-" + bin.rack.warehouse.name;
          batchLineItem.bin = bin;
          batchLineItem.product = unallocated.product;
          batchLineItem.subTotal = unallocated.product.unitPrice * batchLineItem.quantity;
          batchLineItem.unitOfVolumetricSpace = unallocated.unitOfVolumetricSpace;
          const date = new Date();
          date.setDate(date.getDate() + unallocated.product.expiry);
          batchLineItem.expiryDate = date;

          batchLineItems.push(batchLineItem);

          qty -= batchLineItem.quantity;
        }
        if (qty <= 0) {
          const index = cannotBeAllocated.indexOf(unallocated);
          cannotBeAllocated.splice(index, 1);
          break;
        } else {
          const index = cannotBeAllocated.indexOf(unallocated);
          cannotBeAllocated[index].quantity = qty;
        }
      }
    }
    
    if (cannotBeAllocated.length > 0) {
      for (const cannotAllocated of cannotBeAllocated) {
          const batchLineItem = new BatchLineItem();
          batchLineItem.code = "";
          batchLineItem.product = cannotAllocated.product;
          batchLineItem.quantity = cannotAllocated.quantity;
          batchLineItem.subTotal = cannotAllocated.product.unitPrice * cannotAllocated.quantity;
          batchLineItem.unitOfVolumetricSpace = cannotAllocated.unitOfVolumetricSpace;
          const date = new Date();
          date.setDate(date.getDate() + cannotAllocated.product.expiry);
          batchLineItem.expiryDate = date;
          batchLineItems.push(batchLineItem);
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

  async allocate(orgId: number, finalGoodId: number, quantity: number, volumetricSpace: number) {
    const finalGood = await this.finalGoodService.findOne(finalGoodId);
    const batch = new Batch();
    batch.batchNumber = 'B-' + randomUUID().substring(0, 5) + '-' + new Date().toLocaleDateString().replace(/\//g, '-') +
      '-' + new Date().toLocaleTimeString();
    batch.organisationId = orgId;

    const bins = await this.binService.findAllByOrganisationId(orgId);
    const batchLineItems: BatchLineItem[] = [];

    const unitOfVolumetricSpace = volumetricSpace / quantity;
    
    for (const bin of bins) {
      const lineItemCapacity = quantity;
      if (lineItemCapacity <= bin.volumetricSpace - bin.currentCapacity) {
        const batchLineItem = new BatchLineItem();
        batchLineItem.code = "B-" + bin.name + "-R-" + bin.rack.name + "-W-" + bin.rack.warehouse.name;
        batchLineItem.bin = bin;
        batchLineItem.product = finalGood;
        batchLineItem.quantity = quantity
        batchLineItem.unitOfVolumetricSpace = unitOfVolumetricSpace;
        batchLineItem.subTotal = finalGood.unitPrice * quantity;
        const date = new Date();
        date.setDate(date.getDate() + finalGood.expiry);
        batchLineItem.expiryDate = date;
        batchLineItems.push(batchLineItem);
        bin.currentCapacity = bin.currentCapacity + volumetricSpace;
        batch.batchLineItems = batchLineItems
        return batch;
      }
    }

    let qty = quantity;
    for (const bin of bins) {
      const availableSpace = bin.volumetricSpace - bin.currentCapacity;
      const spaceRequired = qty * unitOfVolumetricSpace;
      if (availableSpace > 0) {
        const batchLineItem = new BatchLineItem();
        if (spaceRequired > availableSpace) {
          batchLineItem.quantity =  Math.floor(availableSpace / unitOfVolumetricSpace);
          bin.currentCapacity = bin.currentCapacity + (batchLineItem.quantity * unitOfVolumetricSpace);
        } else {
          batchLineItem.quantity =  qty;
          bin.currentCapacity = bin.currentCapacity + spaceRequired;
        }
        batchLineItem.code = "B-" + bin.name + "-R-" + bin.rack.name + "-W-" + bin.rack.warehouse.name;
        batchLineItem.bin = bin;
        batchLineItem.product = finalGood
        batchLineItem.subTotal = finalGood.unitPrice * batchLineItem.quantity;
        batchLineItem.unitOfVolumetricSpace = unitOfVolumetricSpace;
        const date = new Date();
        date.setDate(date.getDate() + finalGood.expiry);
        batchLineItem.expiryDate = date;
        batchLineItems.push(batchLineItem);

        qty -= batchLineItem.quantity;
      }
      if (qty < 0) {
        break;
      }
    }

    if (qty > 0) {
      const batchLineItem = new BatchLineItem();
      batchLineItem.code = "";
      batchLineItem.product = finalGood;
      batchLineItem.quantity = qty;
      batchLineItem.subTotal = finalGood.unitPrice * qty;
      batchLineItem.unitOfVolumetricSpace = unitOfVolumetricSpace;
      const date = new Date();
      date.setDate(date.getDate() + finalGood.expiry);
      batchLineItem.expiryDate = date;
      batchLineItems.push(batchLineItem);
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
