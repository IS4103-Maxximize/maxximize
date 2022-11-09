import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { RevenueBracketsModule } from '../revenue-brackets/revenue-brackets.module';

@Module({
  imports: [InvoicesModule, OrganisationsModule, RevenueBracketsModule],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService]
})
export class RevenueModule {}
