import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';
import { CreatePurchaseRequisitionDto } from './dto/create-purchase-requisition.dto';
import { UpdatePurchaseRequisitionDto } from './dto/update-purchase-requisition.dto';

@Controller('purchase-requisitions')
export class PurchaseRequisitionsController {
  constructor(private readonly purchaseRequisitionsService: PurchaseRequisitionsService) {}

  @Post()
  create(@Body() createPurchaseRequisitionDto: CreatePurchaseRequisitionDto) {
    return this.purchaseRequisitionsService.create(createPurchaseRequisitionDto);
  }

  @Get()
  findAll() {
    return this.purchaseRequisitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequisitionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRequisitionDto: UpdatePurchaseRequisitionDto) {
    return this.purchaseRequisitionsService.update(+id, updatePurchaseRequisitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRequisitionsService.remove(+id);
  }
}
