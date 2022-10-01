import { forwardRef, Module } from '@nestjs/common';
import { FactoryMachinesService } from './factory-machines.service';
import { FactoryMachinesController } from './factory-machines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactoryMachine } from './entities/factory-machine.entity';
import { Machine } from '../vehicles/entities/vehicle.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ProductionLinesModule } from '../production-lines/production-lines.module';

@Module({
  imports: [TypeOrmModule.forFeature([FactoryMachine, Machine]), OrganisationsModule, forwardRef(() => ProductionLinesModule)],
  controllers: [FactoryMachinesController],
  providers: [FactoryMachinesService],
  exports: [FactoryMachinesService]
})
export class FactoryMachinesModule {}
