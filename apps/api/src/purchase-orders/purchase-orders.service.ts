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
      let supplierOnboarded: Organisation
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (quotationId) {
          quotationToBeAdded = await transactionalEntityManager.findOneOrFail(Quotation, {
            where: {
              id: quotationId
            }, relations: {
              shellOrganisation: {
                contact: true
              },
              currentOrganisation: {
                contact: true
              }
            }
          })
        }
        if (userContactId) {
          userContact = await transactionalEntityManager.findOneByOrFail(Contact, {
            id: userContactId
          })
        }
        //check Quotation if its a shell or a registered organisation
        const {shellOrganisation, currentOrganisation} = quotationToBeAdded
        if (shellOrganisation) {
          supplierContact = shellOrganisation.contact
        } else {
          //quotation is sent to a registered Entity
          supplierOnboarded = currentOrganisation
          supplierContact = currentOrganisation.contact
        }
       
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
          currentOrganisationId: currentOrganisationId,
          quotation: quotationToBeAdded,
          supplier: supplierOnboarded ?? null,
          orgContact,
          userContact,
          supplierContact,
          poLineItems,
          followUpLineItems: []
        })
        return transactionalEntityManager.save(newPurchaseOrder)
        
      })

      if (supplierOnboarded) {
        return this.findOne(newPurchaseOrder.id);
      } else {
        const organisation = await this.organisationsService.findOne(currentOrganisationId)
        const supplier = (await this.quotationsService.findOne(quotationId)).shellOrganisation
        this.mailService.sendPurchaseOrderEmail(supplierContact.email, organisation.name, supplier.name, poLineItems, newPurchaseOrder, newPurchaseOrder.deliveryDate)
      }
      
      return this.findOne(newPurchaseOrder.id);
    } catch (error) {
      throw new NotFoundException(error)
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
        supplierContact: true,
        supplier: true
      }
    })
  }

  findAllByOrgId(organisationId: number): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepository.find({
      where: {
        currentOrganisationId: organisationId
      }, relations: [
        'quotation',
        'currentOrganisation',
        'supplier',
        'orgContact',
        'userContact',
        'supplierContact',
        'poLineItems.rawMaterial',
        'followUpLineItems.rawMaterial',
        'goodsReceipts.goodsReceiptLineItems.product'
      ]
    })
  }

  async findSentPurchaseOrderByOrg(id: number) {
    return await this.purchaseOrdersRepository.find({
      where: {
        currentOrganisationId: id
      }, relations: {
        quotation: {
          shellOrganisation: true,
          receivingOrganisation: true
        },
        currentOrganisation: true,
        supplier: true,
        orgContact: true,
        userContact: true,
        supplierContact: true,
        poLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        followUpLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        goodsReceipts: {
          goodsReceiptLineItems: {
            product: true
          }
        }
      }
    })
  }

  async findReceivedPurchaseOrderByOrg(id: number) {
    return await this.purchaseOrdersRepository.find({
      where: {
        supplierId : id
      }, relations: {
        quotation: {
          shellOrganisation: true,
          receivingOrganisation: true
        },
        currentOrganisation: true,
        supplier: true,
        orgContact: true,
        userContact: true,
        supplierContact: true,
        poLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        followUpLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        goodsReceipts: {
          goodsReceiptLineItems: {
            product: true
          }
        }
      }
    })
  }

  findOne(id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersRepository.findOne({where: {
      id
    }, relations: [
      'quotation',
      'currentOrganisation',
      'supplier',
      'orgContact',
      'userContact',
      'supplierContact',
      'poLineItems.rawMaterial',
      'followUpLineItems.rawMaterial',
      'goodsReceipts.goodsReceiptLineItems.product'
    ]})
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrderToUpdate = await this.purchaseOrdersRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updatePurchaseOrderDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      purchaseOrderToUpdate[key] = value
    })
    await this.purchaseOrdersRepository.save(purchaseOrderToUpdate)
    return this.findOne(id);
  }

  async remove(id: number): Promise<PurchaseOrder> {
    const purchaseOrderToRemove = await this.purchaseOrdersRepository.findOneBy({id})
    return this.purchaseOrdersRepository.remove(purchaseOrderToRemove)
  }

}
