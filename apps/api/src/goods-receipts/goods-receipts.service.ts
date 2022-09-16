import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BatchesService } from '../batches/batches.service';
import { CreateBatchDto } from '../batches/dto/create-batch.dto';
import { Batch } from '../batches/entities/batch.entity';
import { CreateGrLineItemDto } from '../gr-line-items/dto/create-gr-line-item.dto';
import { GrLineItemsService } from '../gr-line-items/gr-line-items.service';
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
    private userService: UsersService,
    private grLineItemService: GrLineItemsService,
    private batchService: BatchesService
  ) {}

  async create(createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const goodReceipt = new GoodsReceipt();
    goodReceipt.createdDateTime = createGoodsReceiptDto.createdDateTime;
    const createGrLineDtos = createGoodsReceiptDto.goodsReceiptLineItemsDtos;
    const goodsReceiptLineItems = [];

    const createBatchDto = new CreateBatchDto();
    createBatchDto.batchLineItems = [];

    createGrLineDtos.forEach(async (dto) => {
      const createGrLineDto = new CreateGrLineItemDto();
      createGrLineDto.rawMaterialId = dto.rawMaterialId;
      createGrLineDto.subtotal = dto.subtotal;
      createGrLineDto.quantity = dto.quantity;
      const grLineItem = await this.grLineItemService.create(createGrLineDto);
      goodsReceiptLineItems.push(grLineItem);

      const batchLineItem = new BatchLineItem();
      batchLineItem.product = grLineItem.product;
      batchLineItem.subTotal = grLineItem.subTotal;
      batchLineItem.quantity = grLineItem.quantity;
      createBatchDto.batchLineItems.push(batchLineItem);
    });

    goodReceipt.goodReceiptLineItems = goodsReceiptLineItems;

    //const purchaseOrder = this.purchaseOrderSerivce.findOne(createGoodsReceiptDto.purchaseOrderId);
    //goodReceipt.purchaseOrder = purchaseOrder;

    const recipient = await this.userService.findOne(
      createGoodsReceiptDto.recipientId
    );
    goodReceipt.recipientName = recipient.firstName + ' ' + recipient.lastName;

    createBatchDto.batchNumber = randomUUID() + new Date().toLocaleDateString();
    const batch = await this.batchService.create(createBatchDto);
    goodReceipt.batch = batch;
    return this.goodsReceiptRepository.save(goodReceipt);
  }

  findAll() {
    return this.goodsReceiptRepository.find({
      relations: ['goodReceiptLineItems'],
    });
  }

  findOne(id: number) {
    return this.goodsReceiptRepository.findOne({
      where: {
        id: id,
      },
      relations: ['goodReceiptLineItems'],
    });
  }

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

  remove(id: number) {
    return this.goodsReceiptRepository.delete(id);
  }
}
