import { Module } from '@nestjs/common';
import { DeliveryRequestsService } from './delivery-requests.service';
import { DeliveryRequestsController } from './delivery-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRequest } from './entities/delivery-request.entity';
import { Order } from '../orders/entities/order.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryRequest, Order, Vehicle])],
  controllers: [DeliveryRequestsController],
  providers: [DeliveryRequestsService]
})
export class DeliveryRequestsModule {}
