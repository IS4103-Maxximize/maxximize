import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { UsersService } from '../users/users.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { GoodsReceipt } from './entities/goods-receipt.entity';

@Injectable()
export class GoodsReceiptsService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly goodsReceiptRepository: Repository<GoodsReceipt>,
    /*private purchaseOrderSerivce: PurchaseOrderService,*/
    private userService: UsersService
  ) {}

  async create(createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const goodReceipt = new GoodsReceipt();
    goodReceipt.createdDateTime = createGoodsReceiptDto.createdDateTime;
    goodReceipt.goodReceiptLineItems = createGoodsReceiptDto.goodsReceiptLineItems;
    
    //const purchaseOrder = this.purchaseOrderSerivce.findOne(createGoodsReceiptDto.purchaseOrderId);
    //goodReceipt.purchaseOrder = purchaseOrder;

    const recipient = await this.userService.findOne(createGoodsReceiptDto.recipientId);
    goodReceipt.recipientName = recipient.firstName + " " + recipient.lastName;

    const batch = new Batch();
    batch.batchLineItems = [];
    createGoodsReceiptDto.goodsReceiptLineItems.forEach((goodReceiptLineItem) => {
      const batchLineItem = new BatchLineItem();
      batchLineItem.product = goodReceiptLineItem.product;
      batchLineItem.subTotal = goodReceiptLineItem.subTotal;
      batchLineItem.batch = batch;
      batch.batchLineItems.push(batchLineItem);
    });
    batch.batchNumber = randomUUID() + new Date().toLocaleDateString();
    batch.goodReceipt = goodReceipt;
    goodReceipt.batch = batch;
    
    return this.goodsReceiptRepository.save(goodReceipt);
  }

  findAll() {
    return this.goodsReceiptRepository.find({
      relations: ["goodReceiptLineItems", "purchaseOrder"]
    });
  }

  findOne(id: number) {
    return this.goodsReceiptRepository.findOne({
      where: {
        id: id
      },
      relations: ["goodReceiptLineItems", "purchaseOrder"]
    });
  }

  async update(id: number, updateGoodsReceiptDto: UpdateGoodsReceiptDto) {
    const goodReceipt = await this.findOne(id);
    const recipient = await this.userService.findOne(updateGoodsReceiptDto.recipientId);
   // const purchaseOrder = await this.purchaseOrderSerivce.findOne(updateGoodsReceiptDto.purchaseOrderId);

    //goodReceipt.purchaseOrder = purchaseOrder;
    goodReceipt.recipientName = recipient.firstName + " " + recipient.lastName;
    goodReceipt.goodReceiptLineItems = updateGoodsReceiptDto.goodsReceiptLineItems;

    // update batch line items
    
    return this.goodsReceiptRepository.save(goodReceipt);
  }

  remove(id: number) {
    return this.goodsReceiptRepository.delete(id);
  }
}
