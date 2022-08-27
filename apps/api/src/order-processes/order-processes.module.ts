import { Module } from '@nestjs/common';
import { OrderProcessesService } from './order-processes.service';
import { OrderProcessesController } from './order-processes.controller';

@Module({
  controllers: [OrderProcessesController],
  providers: [OrderProcessesService]
})
export class OrderProcessesModule {}
