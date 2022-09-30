import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { CreateProductionLineItemDto } from './dto/create-production-line-item.dto';
import { UpdateProductionLineItemDto } from './dto/update-production-line-item.dto';
import { ProductionLineItem } from './entities/production-line-item.entity';

@Injectable()
export class ProductionLineItemsService {
  constructor(
    @InjectRepository(BatchLineItem)
    private readonly batchLineItemsRepository: Repository<BatchLineItem>,
    @InjectRepository(ProductionLineItem)
    private readonly prodLineItemsRepository: Repository<ProductionLineItem>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    @InjectRepository(ProductionOrder)
    private readonly productionOrdersRepository: Repository<ProductionOrder>
  ){}
  async create(createProductionLineItemDto: CreateProductionLineItemDto): Promise<ProductionLineItem>{
    try {
      const { quantity, sufficient, batchLineItemId, rawMaterial, productionOrderId } =
        createProductionLineItemDto;
        let productionOrder = await this.productionOrdersRepository.findOneByOrFail({id: productionOrderId})
        let newProductionLineItem: ProductionLineItem;
        let rawMaterialToBeAdded: RawMaterial;
      if(sufficient && batchLineItemId) {
        let batchLineItem = await this.batchLineItemsRepository.findOneByOrFail({id: batchLineItemId})
        newProductionLineItem = this.prodLineItemsRepository.create({
          quantity,
          sufficient,
          batchLineItem,
          productionOrder
        })
      } else if (!sufficient && rawMaterialId) {
        rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({ id: rawMaterial.idd })
        newProductionLineItem = this.prodLineItemsRepository.create({
          quantity,
          sufficient,
          rawMaterial: rawMaterialToBeAdded,
          productionOrder
        })
        return this.prodLineItemsRepository.save(newProductionLineItem)
      }
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found');
    }
  }

  findAll(): Promise<ProductionLineItem[]> {
    return this.prodLineItemsRepository.find({
      relations: {
        batchLineItem: {
          product: true
        },
        rawMaterial: true,
        productionOrder: true
      }
    })
  }

  findOne(id: number): Promise<ProductionLineItem> {
    return this.prodLineItemsRepository.findOne({
      where: {
        id
      },
      relations: {
        batchLineItem: {
          product: true
        },
        rawMaterial: true,
        productionOrder: true
      }
    })
  }

  async update(id: number, updateProductionLineItemDto: UpdateProductionLineItemDto) {
    const productionLineItemToUpdate = await this.prodLineItemsRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateProductionLineItemDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      productionLineItemToUpdate[key] = value
    })
    return this.prodLineItemsRepository.save(productionLineItemToUpdate)
  }

  async remove(id: number): Promise<ProductionLineItem> {
    const productionLineItem = await this.prodLineItemsRepository.findOneBy({id})
    return this.prodLineItemsRepository.remove(productionLineItem)
  }
}
