import { Module } from '@nestjs/common';
import { DeliveryRequestsService } from './delivery-requests.service';
import { DeliveryRequestsController } from './delivery-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRequest } from './entities/delivery-request.entity';
import { Order } from '../orders/entities/order.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { DeliveryRequestLineItem } from '../delivery-request-line-items/entities/delivery-request-line-item.entity';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { BatchLineItemsModule } from '../batch-line-items/batch-line-items.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature(
    [DeliveryRequest, PurchaseOrder, Vehicle, DeliveryRequestLineItem]),
    PurchaseOrdersModule,
    OrganisationsModule,
    VehiclesModule,
    BatchLineItemsModule,
    UsersModule
  ],
  controllers: [DeliveryRequestsController],
  providers: [DeliveryRequestsService]
})
export class DeliveryRequestsModule {}
