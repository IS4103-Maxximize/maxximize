import { Module } from '@nestjs/common';
import { GrLineItemsService } from './gr-line-items.service';
import { GrLineItemsController } from './gr-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrLineItem } from './entities/gr-line-item.entity';
import { GoodsReceipt } from '../goods-receipts/entities/goods-receipt.entity';
import { LineItem } from '../line-Items/LineItem';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';

@Module({
  imports: [TypeOrmModule.forFeature([GrLineItem, GoodsReceipt, LineItem]), RawMaterialsModule],
  controllers: [GrLineItemsController],
  providers: [GrLineItemsService],
  exports: [GrLineItemsService]
})
export class GrLineItemsModule {}
