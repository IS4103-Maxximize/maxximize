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
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { SchedulesModule } from '../schedules/schedules.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrder, Schedule, ProductionLineItem, Organisation, PurchaseOrder, Batch, BatchLineItem, BillOfMaterial]), BillOfMaterialsModule, OrganisationsModule, RawMaterialsModule, FinalGoodsModule, ScheduleModule.forRoot(), SchedulesModule],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
  exports: [ProductionOrdersService]
})
export class ProductionOrdersModule {}
