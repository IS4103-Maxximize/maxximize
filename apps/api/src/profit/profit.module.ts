import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';
import { RevenueModule } from '../revenue/revenue.module';
import { CostModule } from '../cost/cost.module';

@Module({
  imports: [RevenueModule, CostModule],
  controllers: [ProfitController],
  providers: [ProfitService],
  exports: [ProfitService]
})
export class ProfitModule {}
