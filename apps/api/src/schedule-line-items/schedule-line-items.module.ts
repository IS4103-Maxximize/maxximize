import { Module } from '@nestjs/common';
import { ScheduleLineItemsService } from './schedule-line-items.service';
import { ScheduleLineItemsController } from './schedule-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ScheduleLineItem } from './entities/schedule-line-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, ScheduleLineItem])],
  controllers: [ScheduleLineItemsController],
  providers: [ScheduleLineItemsService],
  exports: [ScheduleLineItemsService]
})
export class ScheduleLineItemsModule {}
