import { Module } from '@nestjs/common';
import { BatchLineItemsService } from './batch-line-items.service';
import { BatchLineItemsController } from './batch-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItem } from './entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { LineItem } from '../line-Items/LineItem';

@Module({
  imports: [TypeOrmModule.forFeature([BatchLineItem, Batch, LineItem])],
  controllers: [BatchLineItemsController],
  providers: [BatchLineItemsService]
})
export class BatchLineItemsModule {}
