import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from '../batches/entities/batch.entity';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { BinsModule } from '../bins/bins.module';
import { Bin } from '../bins/entities/bin.entity';
import { LineItem } from '../line-Items/LineItem';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { BatchLineItemsController } from './batch-line-items.controller';
import { BatchLineItemsService } from './batch-line-items.service';
import { BatchLineItem } from './entities/batch-line-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchLineItem, Batch, LineItem, Bin]), BinsModule, RawMaterialsModule, BillOfMaterialsModule],
  controllers: [BatchLineItemsController],
  providers: [BatchLineItemsService],
  exports: [BatchLineItemsService]
})
export class BatchLineItemsModule {}
