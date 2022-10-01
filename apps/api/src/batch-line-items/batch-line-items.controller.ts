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

  @Get('getLineItem/:billOfMaterialId/:quantity/:organisationId')
  getLineItems(@Param('billOfMaterialId') billOfMaterialId: number, 
    @Param('quantity') quantity: number, @Param('organisationId') organisationId: number) {
    return this.batchLineItemsService.getLineItems(billOfMaterialId, quantity, organisationId, new Date());
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchLineItemsService.remove(+id);
  }
}
