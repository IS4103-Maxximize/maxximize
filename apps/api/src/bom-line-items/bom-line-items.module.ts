import { Module } from '@nestjs/common';
import { BomLineItemsService } from './bom-line-items.service';
import { BomLineItemsController } from './bom-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { Batch } from '../batches/entities/batch.entity';
import { LineItem } from '../line-Items/LineItem';

@Module({
  imports: [TypeOrmModule.forFeature([BomLineItem, Batch, BillOfMaterial, LineItem])],
  controllers: [BomLineItemsController],
  providers: [BomLineItemsService]
})
export class BomLineItemsModule {}
