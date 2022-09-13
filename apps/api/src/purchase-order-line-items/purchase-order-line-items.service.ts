/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    @InjectRepository(FinalGood)
    private readonly finalGoodsRepository: Repository<FinalGood>,
  ){}

  async create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem> {
    try {
      const { quantity, price, unit, rawMaterial, finalGood, purchaseOrder} = createPurchaseOrderLineItemDto
      let rawMaterialToBeAdded: RawMaterial
      let finalGoodToBeAdded: FinalGood
      let purchaseOrderToBeAdded: PurchaseOrder
      rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterial.id})
      if (finalGood) {
        finalGoodToBeAdded = await this.finalGoodsRepository.findOneByOrFail({id: finalGood.id})
      } else {
        finalGoodToBeAdded = null
      }
      purchaseOrderToBeAdded = await this.purchaseOrdersRepository.findOneByOrFail({id: purchaseOrder.id})
      const newPurchaseOrderLineItem = this.poLineItemsRepository.create({
        quantity,
        price,
        unit,
        rawMaterial: rawMaterialToBeAdded,
        finalGood: finalGoodToBeAdded,
        purchaseOrder: purchaseOrderToBeAdded
      })
      purchaseOrderToBeAdded.totalPrice += price*quantity
      this.purchaseOrdersRepository.save(purchaseOrderToBeAdded)
      return this.poLineItemsRepository.save(newPurchaseOrderLineItem)
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
  }

  findAll(): Promise<PurchaseOrderLineItem[]> {
    return this.poLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        purchaseOrder: true
      }
    })
  }

  findOne(id: number): Promise<PurchaseOrderLineItem> {
    return this.poLineItemsRepository.findOne({where: {
      id
    }, relations: {
      rawMaterial: true,
      purchaseOrder: true
    }})
  }

  async update(id: number, updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem>{
    const purchaseOrderLineItemToUpdate = await this.poLineItemsRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updatePurchaseOrderLineItemDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      purchaseOrderLineItemToUpdate[key] = value
    })
    return this.poLineItemsRepository.save(purchaseOrderLineItemToUpdate)
  }

  async remove(id: number): Promise<PurchaseOrderLineItem> {
    const purchaseOrderLineItemToRemove = await this.poLineItemsRepository.findOneBy({id})
    return this.poLineItemsRepository.remove(purchaseOrderLineItemToRemove)
  }
}
