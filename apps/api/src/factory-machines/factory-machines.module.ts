import { Module } from '@nestjs/common';
import { FactoryMachinesService } from './factory-machines.service';
import { FactoryMachinesController } from './factory-machines.controller';

@Module({
  controllers: [FactoryMachinesController],
  providers: [FactoryMachinesService]
})
export class FactoryMachinesModule {}
