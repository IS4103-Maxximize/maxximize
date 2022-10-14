import { forwardRef, Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Machine } from '../vehicles/entities/vehicle.entity';
import { ProductionLinesModule } from '../production-lines/production-lines.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), forwardRef(() => ProductionLinesModule)],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService]
})
export class SchedulesModule {}
