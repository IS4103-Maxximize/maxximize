import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { CreateBillOfMaterialDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto } from './dto/update-bill-of-material.dto';

@Controller('bill-of-materials')
export class BillOfMaterialsController {
  constructor(private readonly billOfMaterialsService: BillOfMaterialsService) {}

  @Post()
  create(@Body() createBillOfMaterialDto: CreateBillOfMaterialDto) {
    return this.billOfMaterialsService.create(createBillOfMaterialDto);
  }

  @Get()
  findAll() {
    return this.billOfMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billOfMaterialsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillOfMaterialDto: UpdateBillOfMaterialDto) {
    return this.billOfMaterialsService.update(+id, updateBillOfMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billOfMaterialsService.remove(+id);
  }
}
