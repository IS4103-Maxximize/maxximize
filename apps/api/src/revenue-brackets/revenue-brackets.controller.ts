import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevenueBracketsService } from './revenue-brackets.service';
import { CreateRevenueBracketDto } from './dto/create-revenue-bracket.dto';
import { UpdateRevenueBracketDto } from './dto/update-revenue-bracket.dto';

@Controller('revenue-brackets')
export class RevenueBracketsController {
  constructor(private readonly revenueBracketsService: RevenueBracketsService) {}

  @Post()
  create(@Body() createRevenueBracketDto: CreateRevenueBracketDto) {
    return this.revenueBracketsService.create(createRevenueBracketDto);
  }

  @Get()
  findAll() {
    return this.revenueBracketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revenueBracketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRevenueBracketDto: UpdateRevenueBracketDto) {
    return this.revenueBracketsService.update(+id, updateRevenueBracketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revenueBracketsService.remove(+id);
  }
}
