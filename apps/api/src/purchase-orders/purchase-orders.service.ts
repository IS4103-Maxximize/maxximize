/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Organisation } from '../organisations/entities/organisation.entity';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Quotation } from '../quotations/entities/quotation.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @InjectRepository(PurchaseOrderLineItem)
    private readonly poLineItemsRepository: Repository<PurchaseOrderLineItem>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
  ) {}
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    try {
      const { deliveryAddress, totalPrice, currentOrganisation, quotation} = createPurchaseOrderDto
      let currentOrganisationToBeAdded: Organisation
      let quotationToBeAdded: Quotation
      quotationToBeAdded = await this.quotationsRepository.findOneByOrFail({id: quotation.id})
      currentOrganisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: currentOrganisation.id})
      const newPurchaseOrder = this.purchaseOrdersRepository.create({
        deliveryAddress,
        totalPrice,
        created: new Date(),
        currentOrganisation: currentOrganisationToBeAdded,
        poLineItems: [],
        quotation: quotationToBeAdded
      })
      return this.purchaseOrdersRepository.save(newPurchaseOrder)
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
  }

  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepository.find({
      relations: {
        quotation: true,
        poLineItems: true,
        currentOrganisation: true
      }
    })
  }

  findOne(id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersRepository.findOne({where: {
      id
    }, relations: {
      quotation: true,
      poLineItems: true,
      currentOrganisation: true
    }})
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrderToUpdate = await this.purchaseOrdersRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updatePurchaseOrderDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      purchaseOrderToUpdate[key] = value
    })
    return this.purchaseOrdersRepository.save(purchaseOrderToUpdate)
  }

  async remove(id: number): Promise<PurchaseOrder> {
    const purchaseOrderToRemove = await this.purchaseOrdersRepository.findOneBy({id})
    return this.purchaseOrdersRepository.remove(purchaseOrderToRemove)
  }

}
