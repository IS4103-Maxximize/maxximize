import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesInquiryService } from './sales-inquiry.service';
import { CreateSalesInquiryDto } from './dto/create-sales-inquiry.dto';
import { UpdateSalesInquiryDto } from './dto/update-sales-inquiry.dto';
import { AddSupplierDto } from './dto/add-supplier.dto';

@Controller('sales-inquiry')
export class SalesInquiryController {
  constructor(private readonly salesInquiryService: SalesInquiryService) {}

  @Post()
  create(@Body() createSalesInquiryDto: CreateSalesInquiryDto) {
    return this.salesInquiryService.create(createSalesInquiryDto);
  }

  @Get()
  findAll() {
    return this.salesInquiryService.findAll();
  }

  @Get('all/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.salesInquiryService.findAllByOrg(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInquiryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesInquiryDto: UpdateSalesInquiryDto
  ) {
    return this.salesInquiryService.update(+id, updateSalesInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesInquiryService.remove(+id);
  }

  @Post('addSupplier')
  addSupplier(
    @Body() addSupplierDto: AddSupplierDto
    ){
      return this.salesInquiryService.addSupplier(addSupplierDto)
    }
}
