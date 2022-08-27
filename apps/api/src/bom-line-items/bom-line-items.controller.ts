import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BomLineItemsService } from './bom-line-items.service';
import { CreateBomLineItemDto } from './dto/create-bom-line-item.dto';
import { UpdateBomLineItemDto } from './dto/update-bom-line-item.dto';

@Controller('bom-line-items')
export class BomLineItemsController {
  constructor(private readonly bomLineItemsService: BomLineItemsService) {}

  @Post()
  create(@Body() createBomLineItemDto: CreateBomLineItemDto) {
    return this.bomLineItemsService.create(createBomLineItemDto);
  }

  @Get()
  findAll() {
    return this.bomLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bomLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBomLineItemDto: UpdateBomLineItemDto) {
    return this.bomLineItemsService.update(+id, updateBomLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bomLineItemsService.remove(+id);
  }
}
