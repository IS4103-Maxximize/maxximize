import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BatchLineItemsModule } from '../batch-line-items/batch-line-items.module';
import { BatchesModule } from '../batches/batches.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { BillingsModule } from '../billings/billings.module';
import { BinsModule } from '../bins/bins.module';
import { BomLineItemsModule } from '../bom-line-items/bom-line-items.module';
import { ContactsModule } from '../contacts/contacts.module';
import { DeliveryRequestsModule } from '../delivery-requests/delivery-requests.module';
import { FactoryMachinesModule } from '../factory-machines/factory-machines.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { GoodsReceiptsModule } from '../goods-receipts/goods-receipts.module';
import { GrLineItemsModule } from '../gr-line-items/gr-line-items.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { OrderLineItemsModule } from '../order-line-items/order-line-items.module';
import { OrdersModule } from '../orders/orders.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ProductsModule } from '../products/products.module';
import { PurchaseOrderLineItemsModule } from '../purchase-order-line-items/purchase-order-line-items.module';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { QuotationLineItemsModule } from '../quotation-line-items/quotation-line-items.module';
import { QuotationsModule } from '../quotations/quotations.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { RecipesModule } from '../recipes/recipes.module';
import { SalesInquiryLineItemsModule } from '../sales-inquiry-line-items/sales-inquiry-line-items.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { SensorsModule } from '../sensors/sensors.module';
import { ShellOrganisationsModule } from '../shell-organisations/shell-organisations.module';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductionLinesModule } from '../production-lines/production-lines.module';
import { QaRulesModule } from '../qa-rules/qa-rules.module';
import { QaChecklistsModule } from '../qa-checklists/qa-checklists.module';
import { FollowUpLineItemsModule } from '../follow-up-line-items/follow-up-line-items.module';

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
    AuthModule,
    // Entitiy Modules
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
    OrdersModule,
    OrganisationsModule,
    ProductsModule,
    RawMaterialsModule,
    RecipesModule,
    SchedulesModule,
    SensorsModule,
    UsersModule,
    VehiclesModule,
    WarehousesModule,
    ShellOrganisationsModule,
    QuotationsModule,
    QuotationLineItemsModule,
    PurchaseOrdersModule,
    PurchaseOrderLineItemsModule,
    SalesInquiryModule,
    SalesInquiryLineItemsModule,
    PurchaseOrderLineItem,
    BatchLineItemsModule,
    GoodsReceiptsModule,
    GrLineItemsModule,
    BinsModule,
    ProductionLinesModule,
    QaRulesModule,
    QaChecklistsModule,
    FollowUpLineItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
