import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [InvoicesModule],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService]
})
export class RevenueModule {}
