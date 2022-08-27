import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderLineItemsService } from './order-line-items.service';
import { CreateOrderLineItemDto } from './dto/create-order-line-item.dto';
import { UpdateOrderLineItemDto } from './dto/update-order-line-item.dto';

@Controller('order-line-items')
export class OrderLineItemsController {
  constructor(private readonly orderLineItemsService: OrderLineItemsService) {}

  @Post()
  create(@Body() createOrderLineItemDto: CreateOrderLineItemDto) {
    return this.orderLineItemsService.create(createOrderLineItemDto);
  }

  @Get()
  findAll() {
    return this.orderLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderLineItemDto: UpdateOrderLineItemDto) {
    return this.orderLineItemsService.update(+id, updateOrderLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderLineItemsService.remove(+id);
  }
}
