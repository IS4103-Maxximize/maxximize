import { Module } from '@nestjs/common';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';
import { PurchaseRequisitionsController } from './purchase-requisitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequisition } from './entities/purchase-requisition.entity';
import { ProductionOrdersModule } from '../production-orders/production-orders.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequisition]), ProductionOrdersModule, SalesInquiryModule, OrganisationsModule],
  controllers: [PurchaseRequisitionsController],
  providers: [PurchaseRequisitionsService],
  exports: [PurchaseRequisitionsService]
})
export class PurchaseRequisitionsModule {}
