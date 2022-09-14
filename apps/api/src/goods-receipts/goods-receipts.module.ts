import { Module } from '@nestjs/common';
import { GoodsReceiptsService } from './goods-receipts.service';
import { GoodsReceiptsController } from './goods-receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceipt } from './entities/goods-receipt.entity';
import { UsersModule } from '../users/users.module';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { Batch } from '../batches/entities/batch.entity';
import { GrLineItem } from '../gr-line-items/entities/gr-line-item.entity';
import { BatchesModule } from '../batches/batches.module';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt, BatchLineItem, GrLineItem, Batch]), /*PurchaseOrderModule,*/ UsersModule, BatchesModule],
  controllers: [GoodsReceiptsController],
  providers: [GoodsReceiptsService]
})
export class GoodsReceiptsModule {}
