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

  async getLineItems(billOfMaterialId: number, quantity: number, organisationId: number, dateOfProduction: Date) {
    const billOfMaterial = await this.billOfMaterialService.findOne(billOfMaterialId);
    const bomLineItems = billOfMaterial.bomLineItems;

    const batchLineItems = await this.findAllByOrganisationId(organisationId);
    const rawMaterialsStock = new Map<number, BatchLineItem[]>();
    const rawMaterialsQuantity = new Map<number, number>();

    // Retrieve all batch line items and add to map only if batch line item does not expire before end of production
    for (const batchLineItem of batchLineItems) {
      const product = batchLineItem.product;
      if (product instanceof RawMaterial && batchLineItem.expiryDate > dateOfProduction) {
        if (!rawMaterialsStock.has(product.id)) {
          const lineItemsArr: BatchLineItem[] = [];
          lineItemsArr.push(batchLineItem);
          rawMaterialsStock.set(product.id, lineItemsArr);
        } else {
          const lineItems = rawMaterialsStock.get(product.id);
          lineItems.push(batchLineItem);
          rawMaterialsStock.set(product.id, lineItems);
        }
        if (rawMaterialsQuantity.has(product.id)) {
          let sum = rawMaterialsQuantity.get(product.id);
          sum += (batchLineItem.quantity - batchLineItem.reservedQuantity);
          rawMaterialsQuantity.set(product.id, sum);
        } else {
          rawMaterialsQuantity.set(product.id, (batchLineItem.quantity - batchLineItem.reservedQuantity));
        }
      }
    }

    let smallestRatio = Number.MAX_VALUE;
    for (const bomLineItem of billOfMaterial.bomLineItems) {
      if (!rawMaterialsQuantity.has(bomLineItem.rawMaterial.id) || smallestRatio < 1) {
        break;
      }
      const stock = rawMaterialsQuantity.get(bomLineItem.rawMaterial.id);
      const ratio = stock / bomLineItem.quantity;
      if (ratio < smallestRatio) {
        smallestRatio = ratio;
      }
    }

    const createProductionLineItemDtos: CreateProductionLineItemDto[] = [];
    let id = 1;
    if (smallestRatio < 1 || rawMaterialsQuantity.size == 0) {
      for (const bomLineItem of billOfMaterial.bomLineItems) {
        const createProductionLineItemDto = new CreateProductionLineItemDto();
        createProductionLineItemDto.id = id;
        createProductionLineItemDto.quantity = quantity * bomLineItem.quantity;
        createProductionLineItemDto.sufficient = false;
        createProductionLineItemDto.rawMaterial = await this.rawMaterialService.findOne(bomLineItem.rawMaterial.id);
        createProductionLineItemDtos.push(createProductionLineItemDto);
        id++;
      }
      return createProductionLineItemDtos;
    }

    const rawMaterialsRequiredMap = new Map<number, number>();
    for (const bomLineItem of bomLineItems) {
      const rawMaterial = bomLineItem.rawMaterial;
      let qty = bomLineItem.quantity * quantity;
      rawMaterialsRequiredMap.set(rawMaterial.id, quantity * bomLineItem.quantity);
      if (smallestRatio < quantity) {
        qty = bomLineItem.quantity * (quantity - Math.floor(smallestRatio));
        const createProductionLineItemDto = new CreateProductionLineItemDto();
        createProductionLineItemDto.quantity = qty;
        createProductionLineItemDto.sufficient = false;
        createProductionLineItemDto.rawMaterial = await this.rawMaterialService.findOne(bomLineItem.rawMaterial.id);
        createProductionLineItemDtos.push(createProductionLineItemDto);
        rawMaterialsRequiredMap.set(rawMaterial.id, Math.floor(smallestRatio) * bomLineItem.quantity);
      }
    }

    for (const [key, value] of rawMaterialsRequiredMap.entries()) {
      let quantityRequired = value;
      const lineItems = rawMaterialsStock.get(key);
      const totalQty = lineItems.reduce((seed, lineItem) => {
        return seed + (lineItem.quantity - lineItem.reservedQuantity)
      }, 0); 
      if (totalQty <= value) {
        for (const batchLineItem of lineItems) {
          const createProductionLineItemDto = new CreateProductionLineItemDto();
          createProductionLineItemDto.quantity = batchLineItem.quantity - batchLineItem.reservedQuantity;
          createProductionLineItemDto.sufficient = true;
          createProductionLineItemDto.rawMaterial = await this.rawMaterialService.findOne(key);
          createProductionLineItemDto.batchLineItemId = batchLineItem.id;
          createProductionLineItemDtos.push(createProductionLineItemDto);
        }
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
          createProductionLineItemDto.rawMaterial = await this.rawMaterialService.findOne(key);
          createProductionLineItemDto.batchLineItemId = batchLineItem.id;
          createProductionLineItemDtos.push(createProductionLineItemDto);
          quantityRequired -= qty;
          if (quantityRequired <= 0) {
            break;
          }
        }
      }
    }

    let num = 1;
    for (const createProductionLineItemDto of createProductionLineItemDtos) {
      createProductionLineItemDto.id = num;
      num++;
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
