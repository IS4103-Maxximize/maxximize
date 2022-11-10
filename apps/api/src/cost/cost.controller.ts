import { Body, Controller, Post } from '@nestjs/common';
import { CostService } from './cost.service';
import { GetCostDto } from './dto/get-cost.dto';

@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Post()
  getCostsByDate(@Body() getCostDto: GetCostDto) {
    return this.costService.getCostByDate(getCostDto)
  }
}
