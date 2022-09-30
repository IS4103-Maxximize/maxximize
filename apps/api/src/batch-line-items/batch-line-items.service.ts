import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { BinsService } from '../bins/bins.service';
import { CreateProductionLineItemDto } from '../production-line-items/dto/create-production-line-item.dto';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';
import { BatchLineItem } from './entities/batch-line-item.entity';

@Injectable()
export class BatchLineItemsService {
  constructor(
    @InjectRepository(BatchLineItem)
    private readonly batchLineItemRepository: Repository<BatchLineItem>,
    private binService: BinsService,
    private rawMaterialService: RawMaterialsService,
    private billOfMaterialService: BillOfMaterialsService,
    private dataSource: DataSource
  ) {}

  async create(createBatchLineItemDto: CreateBatchLineItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batchLineItem = new BatchLineItem();
      const bin = await this.binService.findOne(createBatchLineItemDto.binId);
      const rawMaterial = await this.rawMaterialService.findOne(createBatchLineItemDto.productId);
      batchLineItem.bin = bin;
      batchLineItem.product = rawMaterial;
      batchLineItem.quantity = createBatchLineItemDto.quantity;
      batchLineItem.subTotal = createBatchLineItemDto.subtotal;
      return queryRunner.manager.save(batchLineItem);
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.batchLineItemRepository.find({
      relations: ["product"]
    });
  }

  findOne(id: number) {
    try {
      return this.batchLineItemRepository.findOneOrFail({
        where: {
          id: id
        },
        relations: ["product"]
      });
    } catch (err) {
      throw new NotFoundException(`Batch line items with id: ${id} cannot be found`);
    }
  }

  async findAllByOrganisationId(id: number) {
    return this.batchLineItemRepository.find({
      where: {
        batch: {
          organisationId: id
        }
      },
      relations: ["product"]
    });
  }

  async getLineItems(billOfMaterialId: number, quantity: number, organisationId: number) {
    const billOfMaterial = await this.billOfMaterialService.findOne(billOfMaterialId);
    const bomLineItems = billOfMaterial.bomLineItems;
    const rawMaterialsRequiredMap = new Map<RawMaterial, number>();
    for (const bomLineItem of bomLineItems) {
      const rawMaterial = bomLineItem.rawMaterial;
      const qty = bomLineItem.quantity * quantity;
      rawMaterialsRequiredMap.set(rawMaterial, qty);
    }

    const batchLineItems = await this.findAllByOrganisationId(organisationId);
    const rawMaterialsStock = new Map<number, BatchLineItem[]>();
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

    const createProductionLineItemDtos: CreateProductionLineItemDto[] = [];

    for (const [key, value] of rawMaterialsRequiredMap.entries()) {
      let quantityRequired = value;
      if (rawMaterialsStock.has(key.id)) {
        const lineItems = rawMaterialsStock.get(key.id);
        const totalQty = lineItems.reduce((seed, lineItem) => {
          return seed + (lineItem.quantity - lineItem.reservedQuantity)
        }, 0); 
        if (totalQty <= value) {
          for (const batchLineItem of lineItems) {
            const createProductionLineItemDto = new CreateProductionLineItemDto();
            createProductionLineItemDto.quantity = batchLineItem.quantity - batchLineItem.reservedQuantity;
            createProductionLineItemDto.sufficient = true;
            createProductionLineItemDto.rawMaterialId = batchLineItem.product.id;
            createProductionLineItemDto.batchLineItemId = batchLineItem.id;
            createProductionLineItemDtos.push(createProductionLineItemDto);
          }
          const createProductionLineItemDto = new CreateProductionLineItemDto();
          createProductionLineItemDto.quantity = value - totalQty;
          createProductionLineItemDto.sufficient = false;
          createProductionLineItemDto.rawMaterialId = key.id;
          createProductionLineItemDtos.push(createProductionLineItemDto);
        } else {
          lineItems.sort((lineItemOne, lineItemTwo) => 
            lineItemOne.expiryDate.getTime() - lineItemTwo.expiryDate.getTime()
          );
          for (const batchLineItem of lineItems) {
            const createProductionLineItemDto = new CreateProductionLineItemDto();
            const qty = batchLineItem.quantity - batchLineItem.reservedQuantity;
            if (qty > quantityRequired) {
              createProductionLineItemDto.quantity = quantityRequired
            } else {
              createProductionLineItemDto.quantity = batchLineItem.quantity - batchLineItem.reservedQuantity;
            }
            createProductionLineItemDto.sufficient = true;
            createProductionLineItemDto.rawMaterialId = batchLineItem.product.id;
            createProductionLineItemDto.batchLineItemId = batchLineItem.id;
            createProductionLineItemDtos.push(createProductionLineItemDto);
            quantityRequired -= qty;
            if (quantityRequired <= 0) {
              break;
            }
          } 
        }
      } else {
        const createProductionLineItemDto = new CreateProductionLineItemDto();
        createProductionLineItemDto.quantity = quantityRequired;
        createProductionLineItemDto.sufficient = false;
        createProductionLineItemDto.rawMaterialId = key.id;
        createProductionLineItemDtos.push(createProductionLineItemDto);
      }
    }
    return createProductionLineItemDtos;
  }

  async reserveQuantity(productionLineItemDtos: CreateProductionLineItemDto[]) {
    for (const prodLineItem of productionLineItemDtos) {
      const batchLineItem = await this.findOne(prodLineItem.batchLineItemId);
      batchLineItem.reservedQuantity = prodLineItem.quantity;
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        queryRunner.manager.save(batchLineItem);
      } catch (err) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }

  remove(id: number) {
    return this.batchLineItemRepository.delete(id);
  }
}
