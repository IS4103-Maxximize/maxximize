/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';

@Injectable()
export class PurchaseOrderLineItemsService {
  constructor(
    @InjectRepository(PurchaseOrderLineItem)
    private readonly poLineItemsRepository: Repository<PurchaseOrderLineItem>,
    private datasource: DataSource
  ){}

  async create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem> {
    try{
      const { quantity, price, rawMaterialId, finalGoodId} = createPurchaseOrderLineItemDto
      let rawMaterialToBeAdded: RawMaterial
      let finalGoodToBeAdded: FinalGood
      let newPurchaseOrderLineItem: PurchaseOrderLineItem
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (rawMaterialId) {
          rawMaterialToBeAdded = await transactionalEntityManager.findOneBy(RawMaterial, {
            id: rawMaterialId
          })
        }
        if (finalGoodId) {
          finalGoodToBeAdded = await transactionalEntityManager.findOneBy(FinalGood, {
            id: finalGoodId
          })
        } else {
          finalGoodToBeAdded = null
        }
        newPurchaseOrderLineItem = transactionalEntityManager.create(PurchaseOrderLineItem, {
          quantity,
          price,
          rawMaterial: rawMaterialToBeAdded,
          finalGood: finalGoodToBeAdded
        })
        return transactionalEntityManager.save(newPurchaseOrderLineItem)
      })
      return newPurchaseOrderLineItem 
    } catch (error) {
      throw new NotFoundException("The raw material or final good cannot be found")
    }
          
  }

  findAll(): Promise<PurchaseOrderLineItem[]> {
    return this.poLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        finalGood: true,
        purchaseOrder: true
      }
    })
  }

  async findOne(id: number): Promise<PurchaseOrderLineItem> {
    try {
      return await this.poLineItemsRepository.findOne({where: {
        id
      }, relations: {
        rawMaterial: true,
        finalGood: true,
        purchaseOrder: true
      }})
    } catch (err) {
      throw new NotFoundException('The purchase order line item cannot be found')
    }
    
  }


  async update(id: number, updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem>{
    try {
      const purchaseOrderLineItemToUpdate = await this.poLineItemsRepository.findOneBy({id})
      const arrayOfKeyValues = Object.entries(updatePurchaseOrderLineItemDto)
      arrayOfKeyValues.forEach(([key, value]) => {
        purchaseOrderLineItemToUpdate[key] = value
      })
      return this.poLineItemsRepository.save(purchaseOrderLineItemToUpdate)
    } catch (err) {
      throw new NotFoundException('The purchase order line item cannot be found')
    }
    
  }

  async remove(id: number): Promise<PurchaseOrderLineItem> {
    try{
      const purchaseOrderLineItemToRemove = await this.poLineItemsRepository.findOneBy({id})
      return this.poLineItemsRepository.remove(purchaseOrderLineItemToRemove)
    } catch(err) {
      throw new NotFoundException('The purchase order line item cannot be found')
    }
    
  }
}
