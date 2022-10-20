import { forwardRef, Module } from '@nestjs/common';
import { ChronJobsService } from './chron-jobs.service';
import { ChronJobsController } from './chron-jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChronJob } from './entities/chron-job.entity';
import { SchedulesModule } from '../schedules/schedules.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { ProductionOrdersModule } from '../production-orders/production-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChronJob]), forwardRef(() => SalesInquiryModule), forwardRef(() => SchedulesModule), forwardRef(() => ProductionOrdersModule)],
  controllers: [ChronJobsController],
  providers: [ChronJobsService],
  exports: [ChronJobsService]
})
export class ChronJobsModule {}
