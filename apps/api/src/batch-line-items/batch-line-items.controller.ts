import {
  Body, Controller, Delete, Get, Param, Post, Query
} from '@nestjs/common';
import { BatchLineItemsService } from './batch-line-items.service';
import { AllocationDto } from './dto/allocation.dto';
import { CheckBinCapacityLineItemsDto } from './dto/checkBinCapacityLineItems.dto';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';

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

  @Get('checkBinCapacityAgainstLineItems')
  checkBinCapacityAgainstLineItems(@Query() checkBinCapacityLineItemsDto: CheckBinCapacityLineItemsDto) {
    return this.batchLineItemsService.checkBinCapacityAgainstLineItems(checkBinCapacityLineItemsDto);
  }

  @Get('findAllByOrgId/:id')
  findAllByOrgId(@Param('id') id: string) {
    return this.batchLineItemsService.findAllByOrganisationId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchLineItemsService.findOne(+id);
  }

  @Get('getLineItem/:billOfMaterialId/:quantity/:organisationId/:date')
  getLineItems(
    @Param('billOfMaterialId') billOfMaterialId: number,
    @Param('quantity') quantity: number,
    @Param('organisationId') organisationId: number,
    @Param('date') date: string
  ) {
    return this.batchLineItemsService.getLineItems(
      billOfMaterialId,
      quantity,
      organisationId,
      new Date(date)
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchLineItemsService.remove(+id);
  }

  @Post('autoAllocate')
  autoAllocate(@Body() allocationDto: AllocationDto) {
    return this.batchLineItemsService.autoAllocation(allocationDto);
  }
}
