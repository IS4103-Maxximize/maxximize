import { Module } from '@nestjs/common';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';
import { PurchaseOrderLineItemsController } from './purchase-order-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderLineItem, PurchaseOrder])],
  controllers: [PurchaseOrderLineItemsController],
  providers: [PurchaseOrderLineItemsService],
})
export class PurchaseOrderLineItemsModule {}
