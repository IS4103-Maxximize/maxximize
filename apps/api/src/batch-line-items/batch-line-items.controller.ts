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

  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchLineItemDto: UpdateBatchLineItemDto) {
    return this.batchLineItemsService.update(+id, updateBatchLineItemDto);
  }
  */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchLineItemsService.remove(+id);
  }
}
