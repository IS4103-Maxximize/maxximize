import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BinsModule } from '../bins/bins.module';
import { ProductionOrdersModule } from '../production-orders/production-orders.module';
import { Product } from '../products/entities/product.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseRequisition } from '../purchase-requisitions/entities/purchase-requisition.entity';
import { PurchaseRequisitionsModule } from '../purchase-requisitions/purchase-requisitions.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { Batch } from './entities/batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Product, Warehouse, BatchLineItem, PurchaseOrder, PurchaseRequisition]), WarehousesModule, BinsModule, PurchaseOrder, SalesInquiryModule, PurchaseRequisitionsModule, ProductionOrdersModule],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService]
})
export class BatchesModule {}
