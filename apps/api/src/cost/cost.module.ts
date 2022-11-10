import { Module } from '@nestjs/common';
import { CostService } from './cost.service';
import { CostController } from './cost.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [InvoicesModule, MembershipsModule, SchedulesModule],
  controllers: [CostController],
  providers: [CostService],
  exports: [CostService]
})
export class CostModule {}
