import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';

@Injectable()
export class PurchaseOrderLineItemsService {
  create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto) {
    return 'This action adds a new purchaseOrderLineItem';
  }

  findAll() {
    return `This action returns all purchaseOrderLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderLineItem`;
  }

  update(
    id: number,
    updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto
  ) {
    return `This action updates a #${id} purchaseOrderLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderLineItem`;
  }
}
