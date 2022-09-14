import { Module } from '@nestjs/common';
import { GrLineItemsService } from './gr-line-items.service';
import { GrLineItemsController } from './gr-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrLineItem } from './entities/gr-line-item.entity';
import { GoodsReceipt } from '../goods-receipts/entities/goods-receipt.entity';
import { LineItem } from '../line-Items/LineItem';

@Module({
  imports: [TypeOrmModule.forFeature([GrLineItem, GoodsReceipt, LineItem])],
  controllers: [GrLineItemsController],
  providers: [GrLineItemsService]
})
export class GrLineItemsModule {}
