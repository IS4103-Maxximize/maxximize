import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesModule } from '../batches/batches.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { BillingsModule } from '../billings/billings.module';
import { BomLineItemsModule } from '../bom-line-items/bom-line-items.module';
import { ContactsModule } from '../contacts/contacts.module';
import { DeliveryRequestsModule } from '../delivery-requests/delivery-requests.module';
import { FactoryMachinesModule } from '../factory-machines/factory-machines.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { OrderLineItemsModule } from '../order-line-items/order-line-items.module';
import { OrderProcessesModule } from '../order-processes/order-processes.module';
import { OrdersModule } from '../orders/orders.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ProductsModule } from '../products/products.module';
import { QualityReviewsModule } from '../quality-reviews/quality-reviews.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { RecipesModule } from '../recipes/recipes.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { SensorsModule } from '../sensors/sensors.module';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'maxximize',
      autoLoadEntities: true,
      synchronize: true, // shouldn't be set to 'true' in production
    }),
    BatchesModule,
    BillOfMaterialsModule,
    BillingsModule,
    BomLineItemsModule,
    ContactsModule,
    DeliveryRequestsModule,
    FactoryMachinesModule,
    FinalGoodsModule,
    InvoicesModule,
    OrderLineItemsModule,
    OrderProcessesModule,
    OrdersModule,
    OrganisationsModule,
    ProductsModule,
    QualityReviewsModule,
    RawMaterialsModule,
    RecipesModule,
    SchedulesModule,
    SensorsModule,
    UsersModule,
    VehiclesModule,
    WarehousesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
