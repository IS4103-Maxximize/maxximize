/* eslint-disable prefer-const */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BatchLineItemsService } from '../batch-line-items/batch-line-items.service';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { MailService } from '../mail/mail.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { PurchaseOrderLineItemsService } from '../purchase-order-line-items/purchase-order-line-items.service';
import { Quotation } from '../quotations/entities/quotation.entity';
import { QuotationsService } from '../quotations/quotations.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { ReservationLineItem } from '../reservation-line-items/entities/reservation-line-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReserveDto } from './dto/reserve-dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderStatus } from './enums/purchaseOrderStatus.enum';
import { ShellOrganisationsService } from '../shell-organisations/shell-organisations.service';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { InvoicesService } from '../invoices/invoices.service';

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
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationsRepository: Repository<ShellOrganisation>,
    private datasource: DataSource,
    private organisationsService: OrganisationsService,
    private purchaseOrderLineItemsService: PurchaseOrderLineItemsService,
    private quotationsService: QuotationsService,
    private batchLineItemService: BatchLineItemsService,
    private mailService: MailService,
    private shellOrganisationsService: ShellOrganisationsService,
    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService,
    private dataSource: DataSource
  ) {}
  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    try {
      const {
        deliveryAddress,
        totalPrice,
        deliveryDate,
        currentOrganisationId,
        quotationId,
        userContactId,
        poLineItemDtos,
        supplierId
      } = createPurchaseOrderDto;
      let quotationToBeAdded: Quotation;
      let orgContact: Contact;
      let userContact: Contact;
      let supplierContact: Contact;
      let newPurchaseOrder: PurchaseOrder;
      let poLineItems: PurchaseOrderLineItem[] = [];
      let supplierOnboarded: Organisation;
      await this.datasource.manager.transaction(
        async (transactionalEntityManager) => {
          if (quotationId) {
            quotationToBeAdded = await transactionalEntityManager.findOneOrFail(
              Quotation,
              {
                where: {
                  id: quotationId,
                },
                relations: {
                  shellOrganisation: {
                    contact: true,
                  },
                  currentOrganisation: {
                    contact: true,
                  },
                },
              }
            );
          }
          if (userContactId) {
            userContact = await transactionalEntityManager.findOneByOrFail(
              Contact,
              {
                id: userContactId,
              }
            );
          }
          //check Quotation if its a shell or a registered organisation
          if (quotationToBeAdded) {
            console.log('theres a quotation!')
            const { shellOrganisation, currentOrganisation } = quotationToBeAdded;
            if (shellOrganisation) {
              supplierContact = shellOrganisation.contact;
            } else {
              //quotation is sent to a registered Entity
              supplierOnboarded = currentOrganisation;
              supplierContact = currentOrganisation.contact;
            }
          } else if (supplierId) {
            supplierOnboarded = await this.organisationsService.findOne(supplierId)
          }
          

          for (const dto of poLineItemDtos) {
            const { quantity, price, rawMaterialId, finalGoodId } = dto;
            let rawMaterialToBeAdded: RawMaterial;
            let finalGoodToBeAdded: FinalGood;
            let newPurchaseOrderLineItem: PurchaseOrderLineItem;
            if (rawMaterialId) {
              rawMaterialToBeAdded =
                await transactionalEntityManager.findOneByOrFail(RawMaterial, {
                  id: rawMaterialId,
                });
            }
            if (finalGoodId) {
              finalGoodToBeAdded =
                await transactionalEntityManager.findOneByOrFail(FinalGood, {
                  id: finalGoodId,
                });
            } else {
              finalGoodToBeAdded = null;
            }
            newPurchaseOrderLineItem = transactionalEntityManager.create(
              PurchaseOrderLineItem,
              {
                quantity,
                price,
                rawMaterial: rawMaterialToBeAdded,
                finalGood: finalGoodToBeAdded,
              }
            );
            poLineItems.push(newPurchaseOrderLineItem);
          }
          newPurchaseOrder = transactionalEntityManager.create(PurchaseOrder, {
            status: PurchaseOrderStatus.PENDING,
            deliveryAddress,
            totalPrice,
            created: new Date(),
            deliveryDate: deliveryDate,
            currentOrganisationId: currentOrganisationId,
            quotation: quotationToBeAdded ?? null,
            supplier: supplierOnboarded ?? null,
            orgContact,
            userContact,
            supplierContact,
            poLineItems,
            followUpLineItems: [],
          });
          return transactionalEntityManager.save(newPurchaseOrder);
        }
      );

      if (supplierOnboarded) {
        return this.findOne(newPurchaseOrder.id);
      } else {
        const organisation = await this.organisationsService.findOne(
          currentOrganisationId
        );
        const supplier = (await this.quotationsService.findOne(quotationId))
          .shellOrganisation;
        this.mailService.sendPurchaseOrderEmail(
          supplierContact.email,
          organisation.name,
          supplier.name,
          poLineItems,
          newPurchaseOrder,
          newPurchaseOrder.deliveryDate
        );
      }

      return this.findOne(newPurchaseOrder.id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async createCSV(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    try {
      const { deliveryAddress, totalPrice, deliveryDate, currentOrganisationId, date, poLineItemDtos } = createPurchaseOrderDto
      let newPurchaseOrder: PurchaseOrder
      let poLineItems: PurchaseOrderLineItem[] = []
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        for (const dto of poLineItemDtos) {
          const { quantity, price, finalGoodId } = dto
          let finalGoodToBeAdded: FinalGood
          let newPurchaseOrderLineItem: PurchaseOrderLineItem
          if (finalGoodId) {
            finalGoodToBeAdded = await transactionalEntityManager.findOneByOrFail(FinalGood, {
              id: finalGoodId
            })
          }
          newPurchaseOrderLineItem = transactionalEntityManager.create(PurchaseOrderLineItem, {
            quantity,
            price,
            finalGood: finalGoodToBeAdded
          }) 
          poLineItems.push(newPurchaseOrderLineItem)
        }
        newPurchaseOrder = transactionalEntityManager.create(PurchaseOrder, {
          status: PurchaseOrderStatus.CREATEDVIACSV,
          deliveryAddress,
          totalPrice,
          created: date,
          deliveryDate: null,
          currentOrganisationId: currentOrganisationId,
          quotation: null,
          supplier: null,
          orgContact: null,
          userContact: null,
          supplierContact: null,
          poLineItems,
          followUpLineItems: []
        })
        return transactionalEntityManager.save(newPurchaseOrder)
        
      })
      
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
        supplier: true,
        invoice: true,
      },
    });
  }

  findAllByOrgId(organisationId: number): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepository.find({
      where: {
        currentOrganisationId: organisationId,
      },
      relations: [
        'quotation.shellOrganisation',
        'currentOrganisation',
        'supplier',
        'orgContact',
        'userContact',
        'supplierContact',
        'poLineItems.rawMaterial',
        'followUpLineItems.rawMaterial',
        'goodsReceipts.goodsReceiptLineItems.product',
        'invoice',
      ],
    });
  }

  async findSentPurchaseOrderByOrg(id: number) {
    return await this.purchaseOrdersRepository.find({
      where: {
        currentOrganisationId: id,
      },
      relations: {
        quotation: {
          shellOrganisation: true,
          receivingOrganisation: true,
        },
        currentOrganisation: true,
        supplier: true,
        orgContact: true,
        userContact: true,
        supplierContact: true,
        poLineItems: {
          rawMaterial: true,
          finalGood: true,
        },
        followUpLineItems: {
          rawMaterial: true,
          finalGood: true,
        },
        goodsReceipts: {
          goodsReceiptLineItems: {
            product: true,
          },
        },
        invoice: true,
      },
    });
  }

  async findReceivedPurchaseOrderByOrg(id: number) {
    return await this.purchaseOrdersRepository.find({
      where: {
        supplierId: id,
      },
      relations: {
        quotation: {
          shellOrganisation: true,
          receivingOrganisation: true,
        },
        currentOrganisation: true,
        supplier: true,
        orgContact: true,
        userContact: true,
        supplierContact: true,
        poLineItems: {
          rawMaterial: true,
          finalGood: true,
        },
        followUpLineItems: {
          rawMaterial: true,
          finalGood: true,
        },
        goodsReceipts: {
          goodsReceiptLineItems: {
            product: true,
          },
        },
        invoice: true,
      },
    });
  }

  findOne(id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersRepository.findOne({
      where: {
        id,
      },
      relations: [
        'quotation.shellOrganisation',
        'currentOrganisation',
        'supplier',
        'orgContact',
        'userContact',
        'supplierContact',
        'poLineItems.rawMaterial',
        'poLineItems.finalGood',
        'followUpLineItems.rawMaterial',
        'followUpLineItems.finalGood',
        'goodsReceipts.goodsReceiptLineItems.product',
        'reservationLineItems.batchLineItem.product',
        'invoice',
      ],
    });
  }

  async getUnfufilledLineItems(purchaseOrderId: number) {
    const purchaseOrder = await this.findOne(purchaseOrderId);
    const list = [];
    if (purchaseOrder.followUpLineItems.length === 0) {
      for (const lineItem of purchaseOrder.poLineItems) {
        if (lineItem.fufilledQty != lineItem.quantity) {
          list.push({
            finalGood: lineItem.finalGood,
            quantity: lineItem.quantity - lineItem.fufilledQty,
          });
        }
      }
    } else {
      for (const lineItem of purchaseOrder.followUpLineItems) {
        if (lineItem.fufilledQty != lineItem.quantity) {
          list.push({
            finalGood: lineItem.finalGood,
            quantity: lineItem.quantity - lineItem.fufilledQty,
          });
        }
      }
    }
    return list;
  }

  async update(
    id: number,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    const purchaseOrderToUpdate = await this.findOne(id)
    const arrayOfKeyValues = Object.entries(updatePurchaseOrderDto);
    arrayOfKeyValues.forEach(async ([key, value]) => {
      purchaseOrderToUpdate[key] = value;
      if (key == 'status' && value == PurchaseOrderStatus.ACCEPTED) {
        const shellOrg = await this.shellOrganisationsService.retrieveShellOrgFromUen(purchaseOrderToUpdate.supplier.id, purchaseOrderToUpdate.currentOrganisation.uen)
        shellOrg.currentCredit += purchaseOrderToUpdate.totalPrice
        await this.shellOrganisationsRepository.save(shellOrg)
      } else if (key == 'status' && value == PurchaseOrderStatus.CLOSED){
        const shellOrg = await this.shellOrganisationsService.retrieveShellOrgFromUen(purchaseOrderToUpdate.supplier.id, purchaseOrderToUpdate.currentOrganisation.uen)
        shellOrg.currentCredit -= purchaseOrderToUpdate.totalPrice
        await this.shellOrganisationsRepository.save(shellOrg)
      } else if (key == 'status' && value == PurchaseOrderStatus.FULFILLED) {       
        purchaseOrderToUpdate.invoice = await this.invoicesService.create({
          amount: purchaseOrderToUpdate.totalPrice,
          poId: id
        })
      }
    });
    await this.purchaseOrdersRepository.save(purchaseOrderToUpdate);
    return this.findOne(id);
  }

  async remove(id: number): Promise<PurchaseOrder> {
    const purchaseOrderToRemove = await this.purchaseOrdersRepository.findOneBy(
      { id }
    );
    return this.purchaseOrdersRepository.remove(purchaseOrderToRemove);
  }

  async reserve(reserveDto: ReserveDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseOrderId = reserveDto.purchaseOrderId;
      const organisationId = reserveDto.organisationId;

      const purchaseOrder = await this.findOne(purchaseOrderId);
      const finalGoodsStock =
        await this.batchLineItemService.getAggregatedFinalGoods(
          organisationId,
          purchaseOrder.deliveryDate
        );

      const reservationLineItems = [];
      let lineItems = [];
      if (purchaseOrder.followUpLineItems.length === 0) {
        lineItems = purchaseOrder.poLineItems;
      } else {
        lineItems = purchaseOrder.followUpLineItems;
      }

      for (const lineItem of lineItems) {
        const productId = lineItem.finalGood.id;
        let totalQty = 0;
        if (finalGoodsStock.has(productId)) {
          totalQty = finalGoodsStock.get(productId).reduce((seed, lineItem) => {
            return seed + (lineItem.quantity - lineItem.reservedQuantity);
          }, 0);
        } else {
          continue;
        }
        let qty = lineItem.quantity - lineItem.fufilledQty;
        if (qty <= 0) {
          continue;
        }
        if (totalQty > qty) {
          const batchLineItems = finalGoodsStock.get(productId);
          batchLineItems.sort(
            (lineItemOne, lineItemTwo) =>
              lineItemOne.expiryDate.getTime() -
              lineItemTwo.expiryDate.getTime()
          );
          for (const batchLineItem of batchLineItems) {
            const reservationLineItem = new ReservationLineItem();
            if (batchLineItem.quantity - batchLineItem.reservedQuantity > qty) {
              lineItem.fufilledQty += qty;
              batchLineItem.reservedQuantity += qty;
              reservationLineItem.quantity = qty;
              await queryRunner.manager.save(batchLineItem);
              await queryRunner.manager.save(lineItem);
              qty = 0;
            } else {
              lineItem.fufilledQty +=
                batchLineItem.quantity - batchLineItem.reservedQuantity;
              batchLineItem.reservedQuantity = batchLineItem.quantity;
              reservationLineItem.quantity =
                batchLineItem.quantity - batchLineItem.reservedQuantity;
              qty -= batchLineItem.quantity - batchLineItem.reservedQuantity;
              await queryRunner.manager.save(batchLineItem);
              await queryRunner.manager.save(lineItem);
              //   await queryRunner.manager.softDelete(BatchLineItem, batchLineItem.id);
            }
            reservationLineItem.batchLineItem = batchLineItem;
            reservationLineItems.push(reservationLineItem);
            if (qty <= 0) {
              break;
            }
          }
          lineItem.fufilledQty = lineItem.quantity;
          await queryRunner.manager.save(lineItem);
        } else {
          for (const batchLineItem of finalGoodsStock.get(productId)) {
            const reservationLineItem = new ReservationLineItem();
            reservationLineItem.batchLineItem = batchLineItem;
            reservationLineItem.quantity =
              batchLineItem.quantity - batchLineItem.reservedQuantity;
            lineItem.fufilledQty +=
              batchLineItem.quantity - batchLineItem.reservedQuantity;
            batchLineItem.reservedQuantity = batchLineItem.quantity;
            reservationLineItems.push(reservationLineItem);
            await queryRunner.manager.save(batchLineItem);
            await queryRunner.manager.save(lineItem);
            // await queryRunner.manager.softDelete(BatchLineItem, batchLineItem.id);
          }
        }
      }

      purchaseOrder.reservationLineItems =
        purchaseOrder.reservationLineItems.concat(reservationLineItems);

      const purchaseO = await queryRunner.manager.save(purchaseOrder);
      await queryRunner.commitTransaction();

      return this.findOne(purchaseO.id);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
