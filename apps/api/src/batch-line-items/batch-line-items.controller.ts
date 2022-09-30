import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatchLineItemsService } from './batch-line-items.service';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';
import { GetBatchLineItemProdDto } from './dto/get-batch-line-item-prod.dto';
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

  @Post('/batchLineItemsProd')
  getLineItem(@Body() getBatchLineItemProdDto: GetBatchLineItemProdDto) {
    return this.batchLineItemsService.getLineItems(getBatchLineItemProdDto.billOfMaterialId,
      getBatchLineItemProdDto.quantity, getBatchLineItemProdDto.organisationId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchLineItemsService.remove(+id);
  }
}
