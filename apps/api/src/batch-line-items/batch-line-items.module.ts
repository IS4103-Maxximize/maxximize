import { Module } from '@nestjs/common';
import { BatchLineItemsService } from './batch-line-items.service';
import { BatchLineItemsController } from './batch-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItem } from './entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { LineItem } from '../line-Items/LineItem';
import { Bin } from '../bins/entities/bin.entity';
import { BinsModule } from '../bins/bins.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { BatchesModule } from '../batches/batches.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';

@Module({
  imports: [TypeOrmModule.forFeature([BatchLineItem, Batch, LineItem, Bin]), BinsModule, RawMaterialsModule, BillOfMaterialsModule],
  controllers: [BatchLineItemsController],
  providers: [BatchLineItemsService],
  exports: [BatchLineItemsService]
})
export class BatchLineItemsModule {}
