import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductionLineItemsService } from './production-line-items.service';
import { CreateProductionLineItemDto } from './dto/create-production-line-item.dto';
import { UpdateProductionLineItemDto } from './dto/update-production-line-item.dto';

@Controller('production-line-items')
export class ProductionLineItemsController {
  constructor(
    private readonly productionLineItemsService: ProductionLineItemsService
  ) {}

  @Post()
  create(@Body() createProductionLineItemDto: CreateProductionLineItemDto) {
    return this.productionLineItemsService.create(createProductionLineItemDto);
  }

  @Get()
  findAll() {
    return this.productionLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductionLineItemDto: UpdateProductionLineItemDto
  ) {
    return this.productionLineItemsService.update(
      +id,
      updateProductionLineItemDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionLineItemsService.remove(+id);
  }
}
