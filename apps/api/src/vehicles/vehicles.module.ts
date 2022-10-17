import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { DeliveryRequest } from '../delivery-requests/entities/delivery-request.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Sensor } from '../sensors/entities/sensor.entity';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, DeliveryRequest, Organisation, Schedule, Sensor]), OrganisationsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule {}
