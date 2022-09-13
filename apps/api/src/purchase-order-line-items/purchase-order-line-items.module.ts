import { Module } from '@nestjs/common';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';
import { PurchaseOrderLineItemsController } from './purchase-order-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderLineItem, PurchaseOrder, FinalGood, RawMaterial])],
  controllers: [PurchaseOrderLineItemsController],
  providers: [PurchaseOrderLineItemsService],
})
export class PurchaseOrderLineItemsModule {}
