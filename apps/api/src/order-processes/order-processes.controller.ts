import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderProcessesService } from './order-processes.service';
import { CreateOrderProcessDto } from './dto/create-order-process.dto';
import { UpdateOrderProcessDto } from './dto/update-order-process.dto';

@Controller('order-processes')
export class OrderProcessesController {
  constructor(private readonly orderProcessesService: OrderProcessesService) {}

  @Post()
  create(@Body() createOrderProcessDto: CreateOrderProcessDto) {
    return this.orderProcessesService.create(createOrderProcessDto);
  }

  @Get()
  findAll() {
    return this.orderProcessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderProcessesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderProcessDto: UpdateOrderProcessDto) {
    return this.orderProcessesService.update(+id, updateOrderProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderProcessesService.remove(+id);
  }
}
