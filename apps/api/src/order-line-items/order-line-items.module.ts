import { Module } from '@nestjs/common';
import { OrderLineItemsService } from './order-line-items.service';
import { OrderLineItemsController } from './order-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineItem } from '../line-Items/LineItem';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LineItem, Order])],
  controllers: [OrderLineItemsController],
  providers: [OrderLineItemsService]
})
export class OrderLineItemsModule {}
