import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetProfitDto } from './dto/get-profit.dto';
import { ProfitService } from './profit.service';

@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Post()
  getProfitByDate(@Body() getProfitDto: GetProfitDto) {
    return this.profitService.getProfitByDate(getProfitDto)
  }
}
