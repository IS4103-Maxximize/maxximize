import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuotationLineItemsService } from './quotation-line-items.service';
import { CreateQuotationLineItemDto } from './dto/create-quotation-line-item.dto';
import { UpdateQuotationLineItemDto } from './dto/update-quotation-line-item.dto';

@Controller('quotation-line-items')
export class QuotationLineItemsController {
  constructor(
    private readonly quotationLineItemsService: QuotationLineItemsService
  ) {}

  @Post()
  create(@Body() createQuotationLineItemDto: CreateQuotationLineItemDto) {
    return this.quotationLineItemsService.create(createQuotationLineItemDto);
  }

  @Get()
  findAll() {
    return this.quotationLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationLineItemDto: UpdateQuotationLineItemDto
  ) {
    return this.quotationLineItemsService.update(
      +id,
      updateQuotationLineItemDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationLineItemsService.remove(+id);
  }
}
