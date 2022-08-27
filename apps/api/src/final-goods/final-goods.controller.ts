import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinalGoodsService } from './final-goods.service';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';

@Controller('final-goods')
export class FinalGoodsController {
  constructor(private readonly finalGoodsService: FinalGoodsService) {}

  @Post()
  create(@Body() createFinalGoodDto: CreateFinalGoodDto) {
    return this.finalGoodsService.create(createFinalGoodDto);
  }

  @Get()
  findAll() {
    return this.finalGoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finalGoodsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinalGoodDto: UpdateFinalGoodDto) {
    return this.finalGoodsService.update(+id, updateFinalGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finalGoodsService.remove(+id);
  }
}
