import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BulkDiscountsService } from './bulk-discounts.service';
import { CreateBulkDiscountDto } from './dto/create-bulk-discount.dto';
import { GetDiscountDto } from './dto/get-discount.dto';
import { UpdateBulkDiscountDto } from './dto/update-bulk-discount.dto';

@Controller('bulk-discounts')
export class BulkDiscountsController {
  constructor(private readonly bulkDiscountsService: BulkDiscountsService) {}

  @Post()
  create(@Body() createBulkDiscountDto: CreateBulkDiscountDto) {
    return this.bulkDiscountsService.create(createBulkDiscountDto);
  }

  @Get()
  findAll() {
    return this.bulkDiscountsService.findAll();
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.bulkDiscountsService.findAllByOrg(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bulkDiscountsService.findOne(+id);
  }

  @Get('/active/orgId/:orgId') 
  findActiveByOrg(@Param('orgId') id: string) {
    return this.bulkDiscountsService.findActiveBulkDiscount(+id)
  }

  @Post('discount')
  getDiscount(@Body() getDiscountDto: GetDiscountDto) {
    return this.bulkDiscountsService.getDiscount(getDiscountDto)
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBulkDiscountDto: UpdateBulkDiscountDto) {
    return this.bulkDiscountsService.update(+id, updateBulkDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulkDiscountsService.remove(+id);
  }
}
