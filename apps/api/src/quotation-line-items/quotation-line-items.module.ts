import { Module } from '@nestjs/common';
import { QuotationLineItemsService } from './quotation-line-items.service';
import { QuotationLineItemsController } from './quotation-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationLineItem } from './entities/quotation-line-item.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationLineItem, Quotation, FinalGood, RawMaterial])],
  controllers: [QuotationLineItemsController],
  providers: [QuotationLineItemsService],
  exports: [QuotationLineItemsService]
})
export class QuotationLineItemsModule {}
