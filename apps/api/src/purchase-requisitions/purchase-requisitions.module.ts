import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ProductionLineItemsModule } from '../production-line-items/production-line-items.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { PurchaseRequisition } from './entities/purchase-requisition.entity';
import { PurchaseRequisitionsController } from './purchase-requisitions.controller';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequisition]), ProductionLineItemsModule, SalesInquiryModule, OrganisationsModule, RawMaterialsModule],
  controllers: [PurchaseRequisitionsController],
  providers: [PurchaseRequisitionsService],
  exports: [PurchaseRequisitionsService]
})
export class PurchaseRequisitionsModule {}