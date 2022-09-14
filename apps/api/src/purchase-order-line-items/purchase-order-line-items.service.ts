import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';

@Injectable()
export class PurchaseOrderLineItemsService {
  // constructor(
  //   @InjectRepository(PurchaseOrderLineItem)
  //   private readonly poLineItemsRepository: Repository<PurchaseOrderLineItem>,
  //   @InjectRepository(PurchaseOrder)
  //   private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
  //   @InjectRepository(Quotation)
  //   private readonly quotationsRepository: Repository<Quotation>,
  // ){}

  // async create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem> {
  //   try {
  //     const { quantity, subTotal, organisationRawMaterialId, supplierFinalGoodId, quotation, purchaseOrder} = createPurchaseOrderLineItemDto
  //     let quotationToBeAdded: Quotation
  //     let purchaseOrderToBeAdded: PurchaseOrder
  //     quotationToBeAdded = await this.quotationsRepository.findOneByOrFail({id: quotation.id})
  //     purchaseOrderToBeAdded = await this.purchaseOrdersRepository.findOneByOrFail({id: purchaseOrder.id})
  //     const newPurchaseOrderLineItem = this.poLineItemsRepository.create({
  //       quantity,
  //       subTotal,
  //       organisationRawMaterialId,
  //       supplierFinalGoodId,
  //       quotation: quotationToBeAdded,
  //       purchaseOrder: purchaseOrderToBeAdded
  //     })
  //     return this.poLineItemsRepository.save(newPurchaseOrderLineItem)
  //   } catch (error) {
  //     throw new NotFoundException('The Organisation cannot be found')
  //   }
  // }

  // findAll(): Promise<PurchaseOrderLineItem[]> {
  //   return this.poLineItemsRepository.find({
  //     relations: {
  //       quotation: true,
  //       purchaseOrder: true
  //     }
  //   })
  // }

  // findOne(id: number): Promise<PurchaseOrderLineItem> {
  //   return this.poLineItemsRepository.findOne({where: {
  //     id
  //   }, relations: {
  //     quotation: true,
  //     purchaseOrder: true
  //   }})
  // }

  // async update(id: number, updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto): Promise<PurchaseOrderLineItem>{
  //   const purchaseOrderLineItemToUpdate = await this.poLineItemsRepository.findOneBy({id})
  //   const arrayOfKeyValues = Object.entries(updatePurchaseOrderLineItemDto)
  //   arrayOfKeyValues.forEach(([key, value]) => {
  //     purchaseOrderLineItemToUpdate[key] = value
  //   })
  //   return this.poLineItemsRepository.save(purchaseOrderLineItemToUpdate)
  // }

  // async remove(id: number): Promise<PurchaseOrderLineItem> {
  //   const purchaseOrderLineItemToRemove = await this.poLineItemsRepository.findOneBy({id})
  //   return this.poLineItemsRepository.remove(purchaseOrderLineItemToRemove)
  // }
}
