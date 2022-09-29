import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatchLineItemsService } from './batch-line-items.service';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';
import { UpdateBatchLineItemDto } from './dto/update-batch-line-item.dto';

@Controller('batch-line-items')
export class BatchLineItemsController {
  constructor(private readonly batchLineItemsService: BatchLineItemsService) {}

  @Post()
  create(@Body() createBatchLineItemDto: CreateBatchLineItemDto) {
    return this.batchLineItemsService.create(createBatchLineItemDto);
  }

  @Get()
  findAll() {
    return this.batchLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchLineItemsService.findOne(+id);
  }

  @Get('/test/:id')
  getLineItem(@Param('id') id: string) {
    return this.batchLineItemsService.getLineItems(1, 1, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchLineItemsService.remove(+id);
  }
}
