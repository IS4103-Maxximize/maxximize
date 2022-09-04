import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from '../billings/entities/billing.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Machine } from '../vehicles/entities/vehicle.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, User, Contact, Machine, Order, Warehouse, Billing])],
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  exports: [OrganisationsService]
})
export class OrganisationsModule {}
