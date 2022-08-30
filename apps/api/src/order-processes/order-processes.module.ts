import { Module } from '@nestjs/common';
import { OrderProcessesService } from './order-processes.service';
import { OrderProcessesController } from './order-processes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProcess } from './entities/order-process.entity';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { FactoryMachine } from '../factory-machines/entities/factory-machine.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProcess, BillOfMaterial, FactoryMachine, Order])],
  controllers: [OrderProcessesController],
  providers: [OrderProcessesService]
})
export class OrderProcessesModule {}
