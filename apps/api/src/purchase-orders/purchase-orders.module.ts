import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Contact } from '../contacts/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, ShellOrganisation, PurchaseOrderLineItem, PurchaseOrder, Contact])],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
