import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesInquiryLineItemsService } from './sales-inquiry-line-items.service';
import { CreateSalesInquiryLineItemDto } from './dto/create-sales-inquiry-line-item.dto';
import { UpdateSalesInquiryLineItemDto } from './dto/update-sales-inquiry-line-item.dto';

@Controller('sales-inquiry-line-items')
export class SalesInquiryLineItemsController {
  constructor(
    private readonly salesInquiryLineItemsService: SalesInquiryLineItemsService
  ) {}

  @Post()
  create(@Body() createSalesInquiryLineItemDto: CreateSalesInquiryLineItemDto) {
    return this.salesInquiryLineItemsService.create(
      createSalesInquiryLineItemDto
    );
  }

  @Get()
  findAll() {
    return this.salesInquiryLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInquiryLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesInquiryLineItemDto: UpdateSalesInquiryLineItemDto
  ) {
    return this.salesInquiryLineItemsService.update(
      +id,
      updateSalesInquiryLineItemDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesInquiryLineItemsService.remove(+id);
  }
}
