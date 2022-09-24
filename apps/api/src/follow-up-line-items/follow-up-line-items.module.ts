import { Module } from '@nestjs/common';
import { FollowUpLineItemsService } from './follow-up-line-items.service';
import { FollowUpLineItemsController } from './follow-up-line-items.controller';
import { FollowUpLineItem } from './entities/follow-up-line-item.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FollowUpLineItem, PurchaseOrder, FinalGood, RawMaterial]), PurchaseOrdersModule],
  controllers: [FollowUpLineItemsController],
  providers: [FollowUpLineItemsService],
  exports: [FollowUpLineItemsService]
})
export class FollowUpLineItemsModule {}
