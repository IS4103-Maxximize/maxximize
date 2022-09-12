import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrLineItemsService } from './gr-line-items.service';
import { CreateGrLineItemDto } from './dto/create-gr-line-item.dto';
import { UpdateGrLineItemDto } from './dto/update-gr-line-item.dto';

@Controller('gr-line-items')
export class GrLineItemsController {
  constructor(private readonly grLineItemsService: GrLineItemsService) {}

  @Post()
  create(@Body() createGrLineItemDto: CreateGrLineItemDto) {
    return this.grLineItemsService.create(createGrLineItemDto);
  }

  @Get()
  findAll() {
    return this.grLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrLineItemDto: UpdateGrLineItemDto) {
    return this.grLineItemsService.update(+id, updateGrLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grLineItemsService.remove(+id);
  }
}
