import { Module } from '@nestjs/common';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';
import { PurchaseOrderLineItemsController } from './purchase-order-line-items.controller';

@Module({
  controllers: [PurchaseOrderLineItemsController],
  providers: [PurchaseOrderLineItemsService],
})
export class PurchaseOrderLineItemsModule {}
