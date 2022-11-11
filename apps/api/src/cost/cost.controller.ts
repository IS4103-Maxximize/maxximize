import { Body, Controller, Post } from '@nestjs/common';
import { CostService } from './cost.service';
import { GetCostBreakdownDto } from './dto/get-cost-breakdown.dto';
import { GetCostDto } from './dto/get-cost.dto';

@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Post()
  getCostsByDate(@Body() getCostDto: GetCostDto) {
    return this.costService.getCostByDate(getCostDto)
  }

  @Post('breakdown')
  getCostBreakdown(@Body() getCostBreakdown: GetCostBreakdownDto) {
    return this.costService.getCostBreakdown(getCostBreakdown)
  }
}
