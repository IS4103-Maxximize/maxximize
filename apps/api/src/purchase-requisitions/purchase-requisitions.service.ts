import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { ProductionLineItemsService } from '../production-line-items/production-line-items.service';
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
    private salesInquiryService: SalesInquiryService,
    private rawMaterialService: RawMaterialsService,
    private organisationService: OrganisationsService
  ) {}
  async create(createPurchaseRequisitionDto: CreatePurchaseRequisitionDto) {
    const {productionLineItemId, expectedQuantity, organisationId, rawMaterialId} = createPurchaseRequisitionDto
    const productionLineItem = await this.productionLineItemService.findOne(productionLineItemId)
    const organisation = await this.organisationService.findOne(organisationId)
    const rawMaterial = await this.rawMaterialService.findOne(rawMaterialId)
    const newPurchaseRequisition = this.purchaseRequisitionsRepository.create({
      status: PRStatus.PENDING,
      productionLineItem: productionLineItem,
      organisationId: organisation.id,
      expectedQuantity,
      rawMaterialId: rawMaterial.id,
      quantityToFulfill: expectedQuantity
    })
    const newPR = await this.purchaseRequisitionsRepository.save(newPurchaseRequisition);
    return await this.findOne(newPR.id);
  }

  async findAll() {
    const [purchaseRequisitions, count] = await this.purchaseRequisitionsRepository.findAndCount({
      relations: {
        salesInquiry: true,
        productionLineItem: true,
        rawMaterial: true
      }
    })
    if (count > 0) {
      return purchaseRequisitions
    } else {
      throw new NotFoundException('no Purchase Requisitions Found!')
    }
  }

  async findAllByOrg(id: number) {
    const [purchaseRequisitions, count] = await this.purchaseRequisitionsRepository.findAndCount({where : {
      organisationId: id
    }, relations: {
      salesInquiry: true,
      productionLineItem: {
        productionOrder: true
      },
      rawMaterial: true
    }})
    if (count > 0) {
      return purchaseRequisitions
    } else {
      throw new NotFoundException('No Purchase Requisitions Found!')
    }
  }

  async findOne(id: number) {
    try {
      return await this.purchaseRequisitionsRepository.findOne({
        where: {
          id
        }, relations: {
          salesInquiry: true,
          productionLineItem: {
            productionOrder: true
          },
          rawMaterial: true
        }
      }) 
    } catch (error) {
      throw new NotFoundException(`Purchase requisition with id: ${id} cannot be found!`)
    }
  }

  async update(id: number, updatePurchaseRequisitionDto: UpdatePurchaseRequisitionDto) {
    const keyValuePairs = Object.entries(updatePurchaseRequisitionDto)
    let purchaseRequisitionToUpdate = await this.findOne(id)
    for (const [key, value] of keyValuePairs) {
      if (value) {
        if (key === 'salesInquiryId') {
         purchaseRequisitionToUpdate = await this.retrieveSalesInquiry(purchaseRequisitionToUpdate, value)
        } else if (key === 'fulfilledQuantity') {
          purchaseRequisitionToUpdate = await this.updateFulfilledQty(purchaseRequisitionToUpdate, value)
        }
      }
    }
    await this.purchaseRequisitionsRepository.save(purchaseRequisitionToUpdate)
    return this.findOne(id);
  }

  async remove(id: number) {
    const purchaseRequisitionToRemove = await this.findOne(id)
    return this.purchaseRequisitionsRepository.remove(purchaseRequisitionToRemove)
  }

  async retrieveSalesInquiry(purchaseRequisition: PurchaseRequisition, salesInquiryId: number) {
    if (purchaseRequisition.salesInquiryId === null && purchaseRequisition.status === 'pending') {
      const salesInquiry = await this.salesInquiryService.findOne(salesInquiryId)
      if (salesInquiry) {
        purchaseRequisition.salesInquiryId = salesInquiryId
        purchaseRequisition.status = PRStatus.PROCESSING
        return purchaseRequisition
      }
    } else {
      throw new NotFoundException('Purchase Requisition already has a sales inquiry')
    }
  }

  async updateFulfilledQty(purchaseRequisition: PurchaseRequisition, qty: number) {
    if (purchaseRequisition.status === 'processing' && purchaseRequisition.quantityToFulfill !== 0) {
      purchaseRequisition.quantityToFulfill = qty
      if (qty === 0) {
        //means its fulfilled
        purchaseRequisition.status = PRStatus.FULFILLED
        //TODO: update PR's ProdO status to readytorelease
        const prodLineItemId = purchaseRequisition.productionLineItem.id
        await this.productionLineItemService.softDelete(prodLineItemId)

      }
      return purchaseRequisition
    } else {
      throw new NotFoundException('purchase requisition is not in processing or quantityToFulfill is already 0!')
    }
  }
}
