import { Module } from '@nestjs/common';
import { FactoryMachinesService } from './factory-machines.service';
import { FactoryMachinesController } from './factory-machines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactoryMachine } from './entities/factory-machine.entity';
import { Machine } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FactoryMachine, Machine])],
  controllers: [FactoryMachinesController],
  providers: [FactoryMachinesService]
})
export class FactoryMachinesModule {}
