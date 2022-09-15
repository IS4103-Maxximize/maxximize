import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { Batch } from './entities/batch.entity';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Product, Warehouse, BatchLineItem])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService]
})
export class BatchesModule {}
