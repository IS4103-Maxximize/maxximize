import { Module } from '@nestjs/common';
import { SalesInquiryLineItemsService } from './sales-inquiry-line-items.service';
import { SalesInquiryLineItemsController } from './sales-inquiry-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { SalesInquiryLineItem } from './entities/sales-inquiry-line-item.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesInquiry, SalesInquiryLineItem, RawMaterial])],
  controllers: [SalesInquiryLineItemsController],
  providers: [SalesInquiryLineItemsService],
})
export class SalesInquiryLineItemsModule {}
