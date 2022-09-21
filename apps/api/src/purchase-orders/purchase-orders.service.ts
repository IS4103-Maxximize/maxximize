/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Organisation } from '../organisations/entities/organisation.entity';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { QuotationsService } from '../quotations/quotations.service';
import { PurchaseOrderLineItemsService } from '../purchase-order-line-items/purchase-order-line-items.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { PurchaseOrderStatus } from './enums/purchaseOrderStatus.enum';
import { MailService } from '../mail/mail.service';


@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLineItem)
    private readonly purchaseOrderLineItemsRepository: Repository<PurchaseOrderLineItem>,
    private datasource: DataSource,
    private organisationsService: OrganisationsService,
    private purchaseOrderLineItemsService: PurchaseOrderLineItemsService,
    private quotationsService: QuotationsService,
    private mailService: MailService
  ) {}
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    try {
      const { deliveryAddress, totalPrice, deliveryDate, currentOrganisationId, quotationId, userContactId, poLineItemDtos} = createPurchaseOrderDto
      let quotationToBeAdded: Quotation
      let orgContact: Contact
      let userContact: Contact
      let supplierContact: Contact
      let newPurchaseOrder: PurchaseOrder
      let poLineItems: PurchaseOrderLineItem[] = []
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (quotationId) {
          quotationToBeAdded = await transactionalEntityManager.findOneByOrFail(Quotation, {
            id: quotationId
          })
        }
        if (userContactId) {
          userContact = await transactionalEntityManager.findOneByOrFail(Contact, {
            id: userContactId
          })
        }
        orgContact = (await this.organisationsService.findOne(currentOrganisationId)).contact
        supplierContact = (await this.quotationsService.findOne(quotationId)).shellOrganisation.contact
        for (const dto of poLineItemDtos) {
          const { quantity, price, rawMaterialId, finalGoodId} = dto
          let rawMaterialToBeAdded: RawMaterial
          let finalGoodToBeAdded: FinalGood
          let newPurchaseOrderLineItem: PurchaseOrderLineItem
          if (rawMaterialId) {
            rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
          }
          if (finalGoodId) {
            finalGoodToBeAdded = await transactionalEntityManager.findOneByOrFail(FinalGood, {
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
          poLineItems.push(newPurchaseOrderLineItem)
        }
        newPurchaseOrder = transactionalEntityManager.create(PurchaseOrder, {
          status: PurchaseOrderStatus.PENDING,
          deliveryAddress,
          totalPrice,
          created: new Date(),
          deliveryDate: deliveryDate,
          organisationId: currentOrganisationId,
          quotation: quotationToBeAdded,
          orgContact,
          userContact,
          supplierContact,
          poLineItems,
          followUpLineItems: []
        })
        return transactionalEntityManager.save(newPurchaseOrder)
        
      })
      const organisation = await this.organisationsService.findOne(currentOrganisationId)
      const supplier = (await this.quotationsService.findOne(quotationId)).shellOrganisation
      const deliveryTime = newPurchaseOrder.deliveryDate.toLocaleDateString()
      this.mailService.sendPurchaseOrderEmail(supplierContact.email, organisation.name, supplier.name, poLineItems, newPurchaseOrder, deliveryTime)
      
      return newPurchaseOrder
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
   }

  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepository.find({
      relations: {
        quotation: true,
        poLineItems: true,
        currentOrganisation: true,
        followUpLineItems: true,
        orgContact: true,
        userContact: true,
        supplierContact: true
      }
    })
  }

  findOne(id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersRepository.findOne({where: {
      id
    }, relations: [
      'quotation',
      'poLineItems.rawMaterial',
      'currentOrganisation',
      'followUpLineItems.rawMaterial',
      'orgContact',
      'userContact',
      'supplierContact'
    ]})
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
