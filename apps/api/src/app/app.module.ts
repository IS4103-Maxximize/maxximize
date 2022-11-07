import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BatchLineItemsModule } from '../batch-line-items/batch-line-items.module';
import { BatchesModule } from '../batches/batches.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { BillingsModule } from '../billings/billings.module';
import { BinsModule } from '../bins/bins.module';
import { BomLineItemsModule } from '../bom-line-items/bom-line-items.module';
import { BulkDiscountRangesModule } from '../bulk-discount-ranges/bulk-discount-ranges.module';
import { BulkDiscountsModule } from '../bulk-discounts/bulk-discounts.module';
import { CartLineItemsModule } from '../cart-line-items/cart-line-items.module';
import { CartsModule } from '../carts/carts.module';
import { ContactsModule } from '../contacts/contacts.module';
import { DeliveryRequestLineItemsModule } from '../delivery-request-line-items/delivery-request-line-items.module';
import { DeliveryRequestsModule } from '../delivery-requests/delivery-requests.module';
import { FactoryMachinesModule } from '../factory-machines/factory-machines.module';
import { FilesModule } from '../files/files.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { FollowUpLineItemsModule } from '../follow-up-line-items/follow-up-line-items.module';
import { GoodsReceiptsModule } from '../goods-receipts/goods-receipts.module';
import { GrLineItemsModule } from '../gr-line-items/gr-line-items.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { OrderLineItemsModule } from '../order-line-items/order-line-items.module';
import { OrdersModule } from '../orders/orders.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ProductionLineItemsModule } from '../production-line-items/production-line-items.module';
import { ProductionLinesModule } from '../production-lines/production-lines.module';
import { ProductionOrdersModule } from '../production-orders/production-orders.module';
import { ProductionRequestsModule } from '../production-requests/production-requests.module';
import { ProductsModule } from '../products/products.module';
import { PurchaseOrderLineItem } from '../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { PurchaseOrderLineItemsModule } from '../purchase-order-line-items/purchase-order-line-items.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { PurchaseRequisitionsModule } from '../purchase-requisitions/purchase-requisitions.module';
import { QaChecklistsModule } from '../qa-checklists/qa-checklists.module';
import { QaRulesModule } from '../qa-rules/qa-rules.module';
import { QuotationLineItemsModule } from '../quotation-line-items/quotation-line-items.module';
import { QuotationsModule } from '../quotations/quotations.module';
import { RacksModule } from '../racks/racks.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { RecipesModule } from '../recipes/recipes.module';
import { ReservationLineItemsModule } from '../reservation-line-items/reservation-line-items.module';
import { SalesInquiryLineItemsModule } from '../sales-inquiry-line-items/sales-inquiry-line-items.module';
import { SalesInquiryModule } from '../sales-inquiry/sales-inquiry.module';
import { ScheduleLineItemsModule } from '../schedule-line-items/schedule-line-items.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { SensorsModule } from '../sensors/sensors.module';
import { ShellOrganisationsModule } from '../shell-organisations/shell-organisations.module';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PurchaseRequisitionsModule } from '../purchase-requisitions/purchase-requisitions.module';
import { RacksModule } from '../racks/racks.module';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '../files/files.module';
import { ProductionRequestsModule } from '../production-requests/production-requests.module';
import { DeliveryRequestLineItemsModule } from '../delivery-request-line-items/delivery-request-line-items.module';
import { ReservationLineItemsModule } from '../reservation-line-items/reservation-line-items.module';
import { ScheduleLineItemsModule } from '../schedule-line-items/schedule-line-items.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { AccountInfoModule } from '../account-info/account-info.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'maxximize',
      autoLoadEntities: true,
      synchronize: true, // shouldn't be set to 'true' in production
      logging: false
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
    ProductionLineItemsModule,
    ProductionOrdersModule,
    ScheduleModule.forRoot(),
    PurchaseRequisitionsModule,
    ProductionRequestsModule,
    RacksModule,
    FilesModule,
    DeliveryRequestLineItemsModule,
    DeliveryRequestsModule,
    ReservationLineItemsModule,
    ScheduleLineItemsModule,
    MembershipsModule,
    AccountInfoModule,
    CartsModule,
    CartLineItemsModule,
    BulkDiscountsModule,
    BulkDiscountRangesModule,
    MulterModule.register({
      dest: '/uploads'
    }),
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
