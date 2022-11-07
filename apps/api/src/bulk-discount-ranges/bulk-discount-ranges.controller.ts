import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BulkDiscountRangesService } from './bulk-discount-ranges.service';
import { CreateBulkDiscountRangeDto } from './dto/create-bulk-discount-range.dto';
import { UpdateBulkDiscountRangeDto } from './dto/update-bulk-discount-range.dto';

@Controller('bulk-discount-ranges')
export class BulkDiscountRangesController {
  constructor(private readonly bulkDiscountRangesService: BulkDiscountRangesService) {}

  @Post()
  create(@Body() createBulkDiscountRangeDto: CreateBulkDiscountRangeDto) {
    return this.bulkDiscountRangesService.create(createBulkDiscountRangeDto);
  }

  @Get()
  findAll() {
    return this.bulkDiscountRangesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bulkDiscountRangesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBulkDiscountRangeDto: UpdateBulkDiscountRangeDto) {
    return this.bulkDiscountRangesService.update(+id, updateBulkDiscountRangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulkDiscountRangesService.remove(+id);
  }
}
