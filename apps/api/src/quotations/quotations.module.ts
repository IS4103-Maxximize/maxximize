import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation } from './entities/quotation.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationLineItem } from '../quotation-line-items/entities/quotation-line-item.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesInquiry, PurchaseOrder, ShellOrganisation, Quotation, QuotationLineItem]), SalesInquiryModule, OrganisationsModule],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService]
})
export class QuotationsModule {}
