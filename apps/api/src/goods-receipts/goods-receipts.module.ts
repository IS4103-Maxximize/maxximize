import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesModule } from '../batches/batches.module';
import { Batch } from '../batches/entities/batch.entity';
import { GrLineItem } from '../gr-line-items/entities/gr-line-item.entity';
import { GrLineItemsModule } from '../gr-line-items/gr-line-items.module';
import { UsersModule } from '../users/users.module';
import { GoodsReceipt } from './entities/goods-receipt.entity';
import { GoodsReceiptsController } from './goods-receipts.controller';
import { GoodsReceiptsService } from './goods-receipts.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt, GrLineItem, Batch]), /*PurchaseOrderModule,*/ UsersModule, BatchesModule, GrLineItemsModule],
  controllers: [GoodsReceiptsController],
  providers: [GoodsReceiptsService]
})
export class GoodsReceiptsModule {}
