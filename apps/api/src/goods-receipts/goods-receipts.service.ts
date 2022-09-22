import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { CreateBatchDto } from '../batches/dto/create-batch.dto';
import { GrLineItemsService } from '../gr-line-items/gr-line-items.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { UsersService } from '../users/users.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { GoodsReceipt } from './entities/goods-receipt.entity';

@Injectable()
export class GoodsReceiptsService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly goodsReceiptRepository: Repository<GoodsReceipt>,
    private purchaseOrderSerivce: PurchaseOrdersService,
    private userService: UsersService,
    private grLineItemService: GrLineItemsService,
    private batchService: BatchesService,
    private dataSource: DataSource
  ) {}

  async create(createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const goodReceipt = new GoodsReceipt();
      goodReceipt.createdDateTime = createGoodsReceiptDto.createdDateTime;
      goodReceipt.description = createGoodsReceiptDto.description;
      const createGrLineDtos = createGoodsReceiptDto.goodsReceiptLineItemsDtos;
      const goodsReceiptLineItems = [];

      const createBatchDto = new CreateBatchDto();
      createBatchDto.batchLineItems = [];

      for (const dto of createGrLineDtos) {
        const createdGrLineItem = await this.grLineItemService.createWithExistingTransaction(dto, queryRunner);
        goodsReceiptLineItems.push(createdGrLineItem);
      }

      goodReceipt.goodReceiptLineItems = goodsReceiptLineItems;

      const purchaseOrder = await this.purchaseOrderSerivce.findOne(createGoodsReceiptDto.purchaseOrderId);
      goodReceipt.purchaseOrder = purchaseOrder;

      const recipient = await this.userService.findOne(createGoodsReceiptDto.recipientId);
      goodReceipt.recipientName = recipient.firstName + ' ' + recipient.lastName;

      createBatchDto.batchNumber = "B-" + randomUUID().substring(0, 5) + "-" + 
        new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
      const batch = await this.batchService.createWithExistingTransaction(createBatchDto, goodsReceiptLineItems, queryRunner);
      goodReceipt.batch = batch;

      const createdGr = await queryRunner.manager.save(goodReceipt);
      await queryRunner.commitTransaction();

      return createdGr;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const goodsReceipts = await this.goodsReceiptRepository.find({
      relations: ['goodReceiptLineItems.product']
    });
    if (goodsReceipts.length === 0 || goodsReceipts === undefined) {
      throw new NotFoundException("No goods receipt(s) found");
    }
    return goodsReceipts;
  }

  async findOne(id: number) {
    const goodsReceipt = await this.goodsReceiptRepository.findOne({
      where: {
        id: id,
      },
      relations: ['goodReceiptLineItems']
    });
    if (goodsReceipt) {
      return goodsReceipt;
    } else {
      throw new NotFoundException(`Good receipt with ${id} is not found`);
    }
  }

  /*
  async update(id: number, updateGoodsReceiptDto: UpdateGoodsReceiptDto) {
    const goodReceipt = await this.findOne(id);
    const recipient = await this.userService.findOne(
      updateGoodsReceiptDto.recipientId
    );
    // const purchaseOrder = await this.purchaseOrderSerivce.findOne(updateGoodsReceiptDto.purchaseOrderId);

    //goodReceipt.purchaseOrder = purchaseOrder;
    goodReceipt.recipientName = recipient.firstName + ' ' + recipient.lastName;
    // goodReceipt.goodReceiptLineItems = updateGoodsReceiptDto.goodsReceiptLineItems;

    // update batch line items

    return this.goodsReceiptRepository.save(goodReceipt);
  }
  */

  remove(id: number) {
    return this.goodsReceiptRepository.softDelete(id);
  }
}
