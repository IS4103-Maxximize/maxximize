import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryRequestLineItemsService } from './delivery-request-line-items.service';
import { CreateDeliveryRequestLineItemDto } from './dto/create-delivery-request-line-item.dto';
import { UpdateDeliveryRequestLineItemDto } from './dto/update-delivery-request-line-item.dto';

@Controller('delivery-request-line-items')
export class DeliveryRequestLineItemsController {
  constructor(private readonly deliveryRequestLineItemsService: DeliveryRequestLineItemsService) {}

  @Post()
  create(@Body() createDeliveryRequestLineItemDto: CreateDeliveryRequestLineItemDto) {
    return this.deliveryRequestLineItemsService.create(createDeliveryRequestLineItemDto);
  }

  @Get()
  findAll() {
    return this.deliveryRequestLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryRequestLineItemsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDeliveryRequestLineItemDto: UpdateDeliveryRequestLineItemDto) {
  //   return this.deliveryRequestLineItemsService.update(+id, updateDeliveryRequestLineItemDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryRequestLineItemsService.remove(+id);
  }
}
