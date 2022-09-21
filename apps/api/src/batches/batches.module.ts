import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BinsModule } from '../bins/bins.module';
import { Product } from '../products/entities/product.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { Batch } from './entities/batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Product, Warehouse, BatchLineItem]), WarehousesModule, BinsModule],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService]
})
export class BatchesModule {}
