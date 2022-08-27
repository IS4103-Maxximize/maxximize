import { Module } from '@nestjs/common';
import { OrderLineItemsService } from './order-line-items.service';
import { OrderLineItemsController } from './order-line-items.controller';

@Module({
  controllers: [OrderLineItemsController],
  providers: [OrderLineItemsService]
})
export class OrderLineItemsModule {}
