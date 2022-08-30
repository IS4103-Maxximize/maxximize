import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { DeliveryRequest } from '../delivery-requests/entities/delivery-request.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Sensor } from '../sensors/entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, DeliveryRequest, Organisation, Schedule, Sensor])],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}
