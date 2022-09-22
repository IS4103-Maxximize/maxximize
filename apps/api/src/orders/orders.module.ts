import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { OrderLineItem } from '../order-line-items/entities/order-line-item.entity';
import { DeliveryRequest } from '../delivery-requests/entities/delivery-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Organisation, 
    Invoice, 
    OrderLineItem,
    DeliveryRequest,
  ])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
