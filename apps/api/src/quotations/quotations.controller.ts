import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationsService.create(createQuotationDto);
  }

  @Get()
  findAll() {
    return this.quotationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
    return this.quotationsService.update(+id, updateQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(+id);
  }
}
