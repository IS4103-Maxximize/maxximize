import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from '../billings/entities/billing.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Order } from '../orders/entities/order.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { User } from '../users/entities/user.entity';
import { Machine } from '../vehicles/entities/vehicle.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, User, Contact, Machine, Order, Warehouse, Billing, SalesInquiry, PurchaseOrder, ShellOrganisation])],
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  exports: [OrganisationsService]
})
export class OrganisationsModule {}
