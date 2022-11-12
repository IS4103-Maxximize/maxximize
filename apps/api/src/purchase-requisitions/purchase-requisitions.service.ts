import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { QueryRunner, Repository } from 'typeorm';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { ProductionLineItemsService } from '../production-line-items/production-line-items.service';
import { ProductionOrderStatus } from '../production-orders/enums/production-order-status.enum';
import { ProductionOrdersService } from '../production-orders/production-orders.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { CreatePurchaseRequisitionDto } from './dto/create-purchase-requisition.dto';
import { UpdatePurchaseRequisitionDto } from './dto/update-purchase-requisition.dto';
import { PurchaseRequisition } from './entities/purchase-requisition.entity';
import { PRStatus } from './enums/prStatus.enum';

@Injectable()
export class PurchaseRequisitionsService {
  constructor(
    @InjectRepository(PurchaseRequisition)
    private readonly purchaseRequisitionsRepository: Repository<PurchaseRequisition>,
    private productionLineItemService: ProductionLineItemsService,
    private rawMaterialService: RawMaterialsService,
    private organisationService: OrganisationsService,
    private bomService: BillOfMaterialsService,
    @Inject(forwardRef(() => FinalGoodsService))
    private finalGoodService: FinalGoodsService,
    @Inject(forwardRef(() => SalesInquiryService))
    private salesInquiryService: SalesInquiryService,
    @Inject(forwardRef(() => ProductionOrdersService))
    private productionOrdersService: ProductionOrdersService
  ) {}
  async create(createPurchaseRequisitionDto: CreatePurchaseRequisitionDto) {
    const {
      productionLineItemId,
      expectedQuantity,
      organisationId,
      rawMaterialId,
      requestByType,
      finalGoodId
    } = createPurchaseRequisitionDto;

    let productionLineItem = null;
    if (productionLineItemId) {
      productionLineItem = await this.productionLineItemService.findOne(
        productionLineItemId
      );
      const productionOrder = productionLineItem.productionOrder;
      if (productionOrder.status === 'created') {
        await this.productionOrdersService.update(productionOrder.id, {
          status: ProductionOrderStatus.AWAITINGPROCUREMENT,
        });
      }
    }
    let finalGood;
    if (finalGoodId) {
      finalGood = await this.finalGoodService.findOne(finalGoodId);
    }

    const organisation = await this.organisationService.findOne(organisationId);
    const rawMaterial = await this.rawMaterialService.findOne(rawMaterialId);
    const newPurchaseRequisition = this.purchaseRequisitionsRepository.create({
      status: PRStatus.PENDING,
      productionLineItem: productionLineItem ?? null,
      organisationId: organisation.id,
      expectedQuantity,
      rawMaterialId: rawMaterial.id,
      quantityToFulfill: expectedQuantity,
      createdDateTime: new Date(),
      requestByType: requestByType,
      finalGood: finalGood ?? null
    });
    const newPR = await this.purchaseRequisitionsRepository.save(
      newPurchaseRequisition
    );
    return await this.findOne(newPR.id);
  }

  async findAll() {
    const [purchaseRequisitions, count] =
      await this.purchaseRequisitionsRepository.findAndCount({
        relations: {
          salesInquiry: true,
          productionLineItem: true,
          rawMaterial: true,
        },
      });
    if (count > 0) {
      return purchaseRequisitions;
    } else {
      throw new NotFoundException('no Purchase Requisitions Found!');
    }
  }

  async checkPurchaseRequestFromForecast(orgId: number, finalGoodId: number) {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();

    const count = await this.purchaseRequisitionsRepository
      .createQueryBuilder("purchase_requisition")
      .where('purchase_requisition.createdDateTime BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .andWhere('purchase_requisition.requestByType = :type', {
        type: 'forecast',
      })
      .andWhere('purchase_requisition.organisationId = :orgId', {
        orgId: orgId,
      })
      .andWhere('purchase_requisition.finalGoodId = :finalGoodId', {
        finalGoodId: finalGoodId,
      })
      .getManyAndCount();

    const purchaseRequisitions = count[0];

    const rawMaterialsMap = new Map<number, number>();

    for (const purchaseRequest of purchaseRequisitions) {
      const purchaseReq = await this.findOne(purchaseRequest.id);
      if (rawMaterialsMap.has(purchaseReq.finalGood.id)) {
        let count = rawMaterialsMap.get(purchaseReq.finalGood.id);
        count += purchaseReq.expectedQuantity;
        rawMaterialsMap.set(purchaseReq.finalGood.id, count);
      } else {
        rawMaterialsMap.set(
          purchaseReq.finalGood.id,
          purchaseReq.expectedQuantity
        );
      }
    }

    const bom = await this.bomService.getBOMFromFinalGood(finalGoodId);

    const quantity = rawMaterialsMap.get(bom.bomLineItems[0].rawMaterial.id);

    const quantityRequested = quantity / bom.bomLineItems[0].quantity;

    if (count[1] === 0) {
      return {
        alreadyReq: false,
      };
    } else {
      return {
        alreadyReq: true,
        quantity: quantityRequested,
      };
    }
  }

  async findAllByOrg(id: number) {
    const [purchaseRequisitions, count] =
      await this.purchaseRequisitionsRepository.findAndCount({
        where: {
          organisationId: id,
        },
        relations: {
          finalGood: true,
          salesInquiry: true,
          productionLineItem: {
            productionOrder: true,
          },
          rawMaterial: true,
        },
        withDeleted: true,
      });
    if (count > 0) {
      return purchaseRequisitions;
    } else {
      throw new NotFoundException('No Purchase Requisitions Found!');
    }
  }

  async findOne(id: number) {
    try {
      return await this.purchaseRequisitionsRepository.findOne({
        where: {
          id,
        },
        relations: {
          finalGood: true,
          salesInquiry: true,
          productionLineItem: {
            productionOrder: true,
          },
          rawMaterial: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `Purchase requisition with id: ${id} cannot be found!`
      );
    }
  }

  async update(
    id: number,
    updatePurchaseRequisitionDto: UpdatePurchaseRequisitionDto
  ) {
    const keyValuePairs = Object.entries(updatePurchaseRequisitionDto);
    let purchaseRequisitionToUpdate = await this.findOne(id);
    for (const [key, value] of keyValuePairs) {
      if (value) {
        if (key === 'salesInquiryId') {
          purchaseRequisitionToUpdate = await this.retrieveSalesInquiry(
            purchaseRequisitionToUpdate,
            value
          );
        } else if (key === 'fulfilledQuantity') {
          purchaseRequisitionToUpdate = await this.updateFulfilledQty(
            purchaseRequisitionToUpdate,
            value
          );
        }
      }
    }
    await this.purchaseRequisitionsRepository.save(purchaseRequisitionToUpdate);
    return this.findOne(id);
  }

  async remove(id: number) {
    const purchaseRequisitionToRemove = await this.findOne(id);
    return this.purchaseRequisitionsRepository.remove(
      purchaseRequisitionToRemove
    );
  }

  async retrieveSalesInquiry(
    purchaseRequisition: PurchaseRequisition,
    salesInquiryId: number
  ) {
    if (
      purchaseRequisition.salesInquiryId === null &&
      purchaseRequisition.status === 'pending'
    ) {
      const salesInquiry = await this.salesInquiryService.findOne(
        salesInquiryId
      );
      if (salesInquiry) {
        purchaseRequisition.salesInquiryId = salesInquiryId;
        purchaseRequisition.status = PRStatus.PROCESSING;
        return purchaseRequisition;
      }
    } else {
      throw new NotFoundException(
        'Purchase Requisition already has a sales inquiry'
      );
    }
  }

  async updateFulfilledQty(
    purchaseRequisition: PurchaseRequisition,
    qty: number
  ) {
    let pr = await this.findOne(purchaseRequisition.id);
    if (pr.status === 'processing' && pr.quantityToFulfill !== 0) {
      pr.quantityToFulfill = qty;
      if (qty === 0) {
        //means its fulfilled
        pr.status = PRStatus.FULFILLED;
        //TODO: update PR's ProdO status to readytorelease
        const prodLineItemId = purchaseRequisition.productionLineItem.id;
        await this.productionLineItemService.softDelete(prodLineItemId);
      }
      return this.purchaseRequisitionsRepository.save(purchaseRequisition);
    } else {
      throw new NotFoundException(
        'purchase requisition is not in processing or quantityToFulfill is already 0!'
      );
    }
  }

  async updateFulfilledQtyQueryRunner(
    purchaseRequisition: PurchaseRequisition,
    qty: number,
    queryRunner: QueryRunner
  ) {
    const pr = await this.findOne(purchaseRequisition.id);
    if (pr.status === 'processing' && pr.quantityToFulfill !== 0) {
      pr.quantityToFulfill = qty;
      if (qty === 0) {
        //means its fulfilled
        pr.status = PRStatus.FULFILLED;
        //TODO: update PR's ProdO status to readytorelease
        const prodLineItemId = purchaseRequisition.productionLineItem.id;
        await queryRunner.manager.softDelete(
          ProductionLineItem,
          prodLineItemId
        );
      }
      return await queryRunner.manager.save(pr);
    } else {
      throw new NotFoundException(
        'purchase requisition is not in processing or quantityToFulfill is already 0!'
      );
    }
  }
}
