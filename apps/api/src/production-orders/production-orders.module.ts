import { Module } from '@nestjs/common';
import { ProductionOrdersService } from './production-orders.service';
import { ProductionOrdersController } from './production-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production-order.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ProductionLineItem } from '../production-line-items/entities/production-line-item.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { Batch } from '../batches/entities/batch.entity';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrder, Schedule, ProductionLineItem, Organisation, PurchaseOrder, Batch, BillOfMaterial])],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
