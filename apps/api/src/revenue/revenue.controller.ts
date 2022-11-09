import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { CreateRevenueDto } from './dto/create-revenue.dto';
import { UpdateRevenueDto } from './dto/update-revenue.dto';
import { GetRevenueDto } from './dto/get-revenue.dto';
import { RevenueCommisionDto } from './dto/revenue-commision.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  
  @Post()
  getRevenuesByDate(@Body() getRevenueDto: GetRevenueDto) {
    return this.revenueService.getRevenueByDate(getRevenueDto)
  }

  @Post('commision')
  payCommision(@Body() revenueCommisionDto: RevenueCommisionDto) {
    return this.revenueService.paymentToStripe(revenueCommisionDto)
  }

  @Get('monthlyPayment')
  setUpPayments() {
    return this.revenueService.setUpPayments()
  }

  @Get('commision/:date/:orgId') 
  getCommisionForMonth(@Param('date') date: Date, @Param('orgId') id: string) {
    return this.revenueService.calculateCommisionForMonth(date, +id)
  }
  
}
