import { forwardRef, Module } from '@nestjs/common';
import { BulkDiscountsService } from './bulk-discounts.service';
import { BulkDiscountsController } from './bulk-discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkDiscount } from './entities/bulk-discount.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { BulkDiscountRangesModule } from '../bulk-discount-ranges/bulk-discount-ranges.module';
import { ChronJobsModule } from '../chron-jobs/chron-jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([BulkDiscount]), OrganisationsModule, BulkDiscountRangesModule, forwardRef(() => ChronJobsModule)],
  controllers: [BulkDiscountsController],
  providers: [BulkDiscountsService],
  exports: [BulkDiscountsService]
})
export class BulkDiscountsModule {}
