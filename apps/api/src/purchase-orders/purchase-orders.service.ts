import { Injectable, NotFoundException } from '@nestjs/common';
import { Organisation } from '../organisations/entities/organisation.entity';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Contact } from '../contacts/entities/contact.entity';

@Injectable()
export class PurchaseOrdersService {
  // constructor(
  //   @InjectRepository(Organisation)
  //   private readonly organisationsRepository: Repository<Organisation>,
  //   @InjectRepository(ShellOrganisation)
  //   private readonly shellOrganisationsRepository: Repository<ShellOrganisation>,
  //   @InjectRepository(PurchaseOrderLineItem)
  //   private readonly poLineItemsRepository: Repository<PurchaseOrderLineItem>,
  //   @InjectRepository(PurchaseOrder)
  //   private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
  //   @InjectRepository(Contact)
  //   private readonly contactsRepository: Repository<Contact>,
  // ) {}
  // async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
  //   try {
  //     const { deliveryAddress, contact, totalPrice, createdDateTime, supplierOrganisation, currentOrganisation, poLineItems} = createPurchaseOrderDto
  //     let supplierOrganisationToBeAdded: ShellOrganisation
  //     let currentOrganisationToBeAdded: Organisation
  //     let contactToBeAdded: Contact
  //     supplierOrganisationToBeAdded = await this.shellOrganisationsRepository.findOneByOrFail({id: supplierOrganisation.id})
  //     currentOrganisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: currentOrganisation.id})
  //     contactToBeAdded = await this.contactsRepository.findOneByOrFail({id: contact.id})
  //     const newPurchaseOrder = this.purchaseOrdersRepository.create({
  //       deliveryAddress,
  //       contact: contactToBeAdded,
  //       totalPrice,
  //       createdDateTime,
  //       supplierOrganisation: supplierOrganisationToBeAdded,
  //       currentOrganisation: currentOrganisationToBeAdded,
  //       poLineItems
  //     })
  //     return this.purchaseOrdersRepository.save(newPurchaseOrder)
  //   } catch (error) {
  //     throw new NotFoundException('The Organisation cannot be found')
  //   }
  // }

  // findAll(): Promise<PurchaseOrder[]> {
  //   return this.purchaseOrdersRepository.find({
  //     relations: {
  //       supplierOrganisation: true,
  //       currentOrganisation: true
  //     }
  //   })
  // }

  // findOne(id: number): Promise<PurchaseOrder> {
  //   return this.purchaseOrdersRepository.findOne({where: {
  //     id
  //   }, relations: {
  //     supplierOrganisation: true,
  //     currentOrganisation: true
  //   }})
  // }

  // async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
  //   const purchaseOrderToUpdate = await this.purchaseOrdersRepository.findOneBy({id})
  //   const arrayOfKeyValues = Object.entries(updatePurchaseOrderDto)
  //   arrayOfKeyValues.forEach(([key, value]) => {
  //     purchaseOrderToUpdate[key] = value
  //   })
  //   return this.purchaseOrdersRepository.save(purchaseOrderToUpdate)
  // }

  // async remove(id: number): Promise<PurchaseOrder> {
  //   const purchaseOrderToRemove = await this.purchaseOrdersRepository.findOneBy({id})
  //   return this.purchaseOrdersRepository.remove(purchaseOrderToRemove)
  // }
}
