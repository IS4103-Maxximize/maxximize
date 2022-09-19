import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';

@Controller('production-lines')
export class ProductionLinesController {
  constructor(private readonly productionLinesService: ProductionLinesService) {}

  @Post()
  create(@Body() createProductionLineDto: CreateProductionLineDto) {
    return this.productionLinesService.create(createProductionLineDto);
  }

  @Get()
  findAll() {
    return this.productionLinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionLinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionLineDto: UpdateProductionLineDto) {
    return this.productionLinesService.update(+id, updateProductionLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionLinesService.remove(+id);
  }
}
