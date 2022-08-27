import { Injectable } from '@nestjs/common';
import { CreateOrderLineItemDto } from './dto/create-order-line-item.dto';
import { UpdateOrderLineItemDto } from './dto/update-order-line-item.dto';

@Injectable()
export class OrderLineItemsService {
  create(createOrderLineItemDto: CreateOrderLineItemDto) {
    return 'This action adds a new orderLineItem';
  }

  findAll() {
    return `This action returns all orderLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLineItem`;
  }

  update(id: number, updateOrderLineItemDto: UpdateOrderLineItemDto) {
    return `This action updates a #${id} orderLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLineItem`;
  }
}
