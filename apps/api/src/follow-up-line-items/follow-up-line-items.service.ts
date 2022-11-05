import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { CreateFollowUpLineItemDto } from './dto/create-follow-up-line-item.dto';
import { UpdateFollowUpLineItemDto } from './dto/update-follow-up-line-item.dto';
import { FollowUpLineItem } from './entities/follow-up-line-item.entity';

@Injectable()
export class FollowUpLineItemsService {
  constructor(
    @InjectRepository(FollowUpLineItem)
    private readonly followUpLineItemsRepository: Repository<FollowUpLineItem>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    @InjectRepository(FinalGood)
    private readonly finalGoodsRepository: Repository<FinalGood>,
    private purchaseOrdersService: PurchaseOrdersService
  ){}
  async create(createFollowUpLineItemDto: CreateFollowUpLineItemDto): Promise<FollowUpLineItem> {
    try {
      const { quantity, rawMaterialId, finalGoodId, purchaseOrderId} = createFollowUpLineItemDto
      let finalGoodToBeAdded: FinalGood
      const rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterialId})
      if (finalGoodId) {
        finalGoodToBeAdded = await this.finalGoodsRepository.findOneByOrFail({id: finalGoodId})
      } else {
        finalGoodToBeAdded = null
      }
      const purchaseOrderToBeAdded = await this.purchaseOrdersService.findOne(purchaseOrderId)
      const newFollowUpLineItem = this.followUpLineItemsRepository.create({
        quantity,
        rawMaterial: rawMaterialToBeAdded,
        finalGood: finalGoodToBeAdded,
        purchaseOrder: purchaseOrderToBeAdded
      });
      return this.followUpLineItemsRepository.save(newFollowUpLineItem)
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
    
  }

  async createWithExistingTransaction(createFollowUpLineItemDto: CreateFollowUpLineItemDto, queryRunner: QueryRunner) {
    const followUpLineItem = new FollowUpLineItem();
    followUpLineItem.quantity = createFollowUpLineItemDto.quantity;
    if (createFollowUpLineItemDto.rawMaterialId) {
      followUpLineItem.rawMaterial = await this.rawMaterialsRepository.findOneByOrFail({id: createFollowUpLineItemDto.rawMaterialId});
    }
    if (createFollowUpLineItemDto.finalGoodId) {
      followUpLineItem.finalGood = await this.finalGoodsRepository.findOneByOrFail({id: createFollowUpLineItemDto.finalGoodId});
    }
    followUpLineItem.purchaseOrder = await this.purchaseOrdersService.findOne(createFollowUpLineItemDto.purchaseOrderId);
    return queryRunner.manager.save(followUpLineItem);
  }

  findAll(): Promise<FollowUpLineItem[]> {
    return this.followUpLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        purchaseOrder: true
      }
    })
  }

  findOne(id: number) {
    return this.followUpLineItemsRepository.findOne({where: {

      id
    }, relations: {
      rawMaterial: true,
      purchaseOrder: true
    }})
  }

  async update(id: number, updateFollowUpLineItemDto: UpdateFollowUpLineItemDto): Promise<FollowUpLineItem> {
    const quotationLineItemToUpdate = await this.followUpLineItemsRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateFollowUpLineItemDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      quotationLineItemToUpdate[key] = value
    })
    return this.followUpLineItemsRepository.save(quotationLineItemToUpdate)
  }

  async remove(id: number): Promise<FollowUpLineItem> {
    const followUpLineItemToRemove = await this.followUpLineItemsRepository.findOneBy({id})
    return this.followUpLineItemsRepository.remove(followUpLineItemToRemove)
  }
}
