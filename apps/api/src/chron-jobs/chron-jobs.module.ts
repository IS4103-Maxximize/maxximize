import { forwardRef, Module } from '@nestjs/common';
import { ChronJobsService } from './chron-jobs.service';
import { ChronJobsController } from './chron-jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChronJob } from './entities/chron-job.entity';
import { SchedulesModule } from '../schedules/schedules.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChronJob]), SchedulesModule, forwardRef(() => SalesInquiryModule),],
  controllers: [ChronJobsController],
  providers: [ChronJobsService],
  exports: [ChronJobsService]
})
export class ChronJobsModule {}
