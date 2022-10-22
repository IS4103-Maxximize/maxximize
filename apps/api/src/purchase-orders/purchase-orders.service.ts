/* eslint-disable prefer-const */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { ReservationLineItem } from '../reservation-line-items/entities/reservation-line-item.entity';
import { ReserveDto } from './dto/reserve-dto';


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
    private batchLineItemService: BatchLineItemsService,
    private mailService: MailService,
    private dataSource: DataSource
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
      'poLineItems.finalGood',
      'followUpLineItems.rawMaterial',
      'goodsReceipts.goodsReceiptLineItems.product',
      'reservationLineItems'
    ]})
  }

  async getUnfufilledLineItems(purchaseOrderId: number) {
    const purchaseOrder = await this.findOne(purchaseOrderId);
    const list = [];
    for (const lineItem of purchaseOrder.poLineItems) {
      if (lineItem.fufilledQty != lineItem.quantity) {
        list.push({
          finalGood: lineItem.finalGood,
          quantity: lineItem.quantity - lineItem.fufilledQty
        })
      }
    }
    return list;
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

  async reserve(reserveDto: ReserveDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseOrderId = reserveDto.purchaseOrderId;
      const organisationId = reserveDto.organisationId;

      const purchaseOrder = await this.findOne(purchaseOrderId);
      const finalGoodsStock = await this.batchLineItemService.getAggregatedFinalGoods(organisationId, purchaseOrder.deliveryDate);
      console.log(finalGoodsStock);

      const reservationLineItems = [];

      for (const purchaseLineItem of purchaseOrder.poLineItems) {
        const productId = purchaseLineItem.finalGood.id;
        let totalQty = 0;
        if (finalGoodsStock.has(productId)) {
          totalQty = finalGoodsStock.get(productId).reduce((seed, lineItem) => {
            return seed + (lineItem.quantity - lineItem.reservedQuantity);
          }, 0);
        } else {
          continue;
        }
        let qty = purchaseLineItem.quantity - purchaseLineItem.fufilledQty;
        if (qty <= 0) {
          continue;
        }
        if (totalQty > qty) {
          const batchLineItems = finalGoodsStock.get(productId);
          batchLineItems.sort(
            (lineItemOne, lineItemTwo) =>
              lineItemOne.expiryDate.getTime() - lineItemTwo.expiryDate.getTime()
          );
          for (const batchLineItem of batchLineItems) {
            const reservationLineItem = new ReservationLineItem();
            if ((batchLineItem.quantity - batchLineItem.reservedQuantity) > qty) {
              purchaseLineItem.fufilledQty += qty;
              batchLineItem.reservedQuantity += qty;
              reservationLineItem.quantity = qty;
              await queryRunner.manager.save(batchLineItem);
              await queryRunner.manager.save(purchaseLineItem);
              qty = 0;
            } else {
              purchaseLineItem.fufilledQty += (batchLineItem.quantity - batchLineItem.reservedQuantity);
              batchLineItem.reservedQuantity = batchLineItem.quantity;
              reservationLineItem.quantity = (batchLineItem.quantity - batchLineItem.reservedQuantity);
              qty -= (batchLineItem.quantity - batchLineItem.reservedQuantity);
              await queryRunner.manager.save(batchLineItem);
              await queryRunner.manager.save(purchaseLineItem);
              await queryRunner.manager.softDelete(BatchLineItem, batchLineItem.id);
            }
            reservationLineItem.batchLineItem = batchLineItem;
            reservationLineItems.push(reservationLineItem);
            if (qty <= 0) {
              break;
            }
          }
          purchaseLineItem.fufilledQty = purchaseLineItem.quantity;
          await queryRunner.manager.save(purchaseLineItem);
        } else {
          for (const batchLineItem of finalGoodsStock.get(productId)) {
            const reservationLineItem = new ReservationLineItem();
            reservationLineItem.batchLineItem = batchLineItem;
            reservationLineItem.quantity = (batchLineItem.quantity - batchLineItem.reservedQuantity);
            purchaseLineItem.fufilledQty += (batchLineItem.quantity - batchLineItem.reservedQuantity);
            batchLineItem.reservedQuantity = batchLineItem.quantity;
            reservationLineItems.push(reservationLineItem);
            await queryRunner.manager.save(batchLineItem);
            await queryRunner.manager.save(purchaseLineItem);
            await queryRunner.manager.softDelete(BatchLineItem, batchLineItem.id);
          }
        }
      }

      purchaseOrder.reservationLineItems = purchaseOrder.reservationLineItems.concat(reservationLineItems);

      const purchaseO = await queryRunner.manager.save(purchaseOrder);
      await queryRunner.commitTransaction();

      return purchaseO;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
