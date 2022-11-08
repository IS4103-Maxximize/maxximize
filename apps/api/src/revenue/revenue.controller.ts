import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { CreateRevenueDto } from './dto/create-revenue.dto';
import { UpdateRevenueDto } from './dto/update-revenue.dto';
import { getRevenueDto } from './dto/get-revenue.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  
  @Post()
  getRevenuesByDate(@Body() getRevenueDto: getRevenueDto) {
    return this.revenueService.getRevenueByDate(getRevenueDto)
  }
}
