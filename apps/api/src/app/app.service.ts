import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountInfoService } from '../account-info/account-info.service';
import { BatchesService } from '../batches/batches.service';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { BinsService } from '../bins/bins.service';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { FactoryMachinesService } from '../factory-machines/factory-machines.service';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { GoodsReceiptsService } from '../goods-receipts/goods-receipts.service';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { MembershipStatus } from '../memberships/enums/membership-status.enum';
import { SubscriptionPlan } from '../memberships/enums/subscription-plan.enum';
import { MembershipsService } from '../memberships/memberships.service';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { ProductionOrdersService } from '../production-orders/production-orders.service';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { PurchaseOrderStatus } from '../purchase-orders/enums/purchaseOrderStatus.enum';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { QuotationLineItemsService } from '../quotation-line-items/quotation-line-items.service';
import { QuotationsService } from '../quotations/quotations.service';
import { RacksService } from '../racks/racks.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { RevenueBracketsService } from '../revenue-brackets/revenue-brackets.service';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { SchedulesService } from '../schedules/schedules.service';
import { ShellOrganisationsService } from '../shell-organisations/shell-organisations.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import { UsersService } from '../users/users.service';
import { WarehousesService } from '../warehouses/warehouses.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private organisationsService: OrganisationsService,
    private usersService: UsersService,
    private contactsService: ContactsService,
    private warehousesService: WarehousesService,
    private binsService: BinsService,
    private rawMaterialsService: RawMaterialsService,
    private finalGoodsService: FinalGoodsService,
    private shellOrganisationsService: ShellOrganisationsService,
    private salesInquiryService: SalesInquiryService,
    private quotationService: QuotationsService,
    private quotationLineItemService: QuotationLineItemsService,
    private purchaseOrderService: PurchaseOrdersService,
    private goodsReceiptService: GoodsReceiptsService,
    private rackService: RacksService,
    private batchService: BatchesService,
    private dataSource: DataSource,
    private bomService: BillOfMaterialsService,
    private factoryMachineService: FactoryMachinesService,
    private productionLineService: ProductionLinesService,
    private revenueBracketsService: RevenueBracketsService,
    private membershipService: MembershipsService,
    private invoiceService: InvoicesService,
    private productionOrdersService: ProductionOrdersService,
    private schedulesService: SchedulesService,
    private accountInfosService: AccountInfoService
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async onApplicationBootstrap() {
    const maxximize = await this.organisationsService.findOrganisationByType(
      OrganisationType.MAXXIMIZE
    );
    if (maxximize.length === 0) {
      await this.organisationsService.create({
        name: 'MaxxiMize',
        type: OrganisationType.MAXXIMIZE,
        uen: '999999999',
        contact: {
          phoneNumber: '88880000',
          email: 'maxximize@gmail.com',
          address: 'Serangoon Gardens',
          postalCode: '789273',
        },
      });

      await this.organisationsService.create({
        name: 'Prego',
        type: OrganisationType.MANUFACTURER,
        uen: 'Prego-12345',
        contact: {
          phoneNumber: '94893849',
          email: 'prego@gmail.com',
          address: 'Chua chu kang',
          postalCode: '723123',
        },
      });

      await this.organisationsService.create({
        name: 'Hai Di Lao',
        type: OrganisationType.RETAILER,
        uen: 'HDL-12345',
        contact: {
          phoneNumber: '93492348',
          email: 'r1@gmail.com',
          address: 'RetailAddress1',
          postalCode: '371839',
        },
      });

      await this.organisationsService.create({
        name: 'Nissin',
        uen: 'Nis-12345',
        type: OrganisationType.MANUFACTURER,
        contact: {
          phoneNumber: '92312312',
          email: 'nissin@gmail.com',
          address: 'Boon lay road',
          postalCode: '123123',
        },
      });

      await this.organisationsService.create({
        name: 'WcDonalds',
        type: OrganisationType.RETAILER,
        uen: 'WCD-12345',
        contact: {
          phoneNumber: '93492347',
          email: 'wcdonalds@gmail.com',
          address: 'RetailAddress2',
          postalCode: '376839',
        },
      });

      await this.organisationsService.create({
        name: 'Burger Queen',
        type: OrganisationType.RETAILER,
        uen: 'BGQ-12345',
        contact: {
          phoneNumber: '90292348',
          email: 'burgerqueen@gmail.com',
          address: 'RetailAddress3',
          postalCode: '555839',
        },
      });

      await this.organisationsService.create({
        name: 'Tehtiam',
        type: OrganisationType.RETAILER,
        uen: 'TEH-12345',
        contact: {
          phoneNumber: '93402349',
          email: 'teh@gmail.com',
          address: 'RetailAddress4',
          postalCode: '371841',
        },
      });

      await this.organisationsService.create({
        name: 'Formosa',
        type: OrganisationType.RETAILER,
        uen: 'FOR-12345',
        contact: {
          phoneNumber: '93412348',
          email: 'formosa@gmail.com',
          address: 'RetailAddress5',
          postalCode: '471839',
        },
      });

      await this.usersService.create({
        firstName: 'Max',
        lastName: 'Admin',
        role: Role.ADMIN,
        contact: {
          phoneNumber: '88880000',
          email: 'maxximize4103@gmail.com',
          address: 'Serangoon Gardens',
          postalCode: '789273',
        },
        username: 'maxadmin',
        organisationId: 1,
      });

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Contact)
        .values([
          {
            id: 10,
            phoneNumber: '93894938',
            email: 'mc1@gmail.com',
            address: 'ManuCusAddress1',
            postalCode: '423423',
          },
          {
            id: 11,
            phoneNumber: '92390489',
            email: 'rc1@gmail.com',
            address: 'RetailCusAddress1',
            postalCode: '534523',
          },
          {
            id: 12,
            phoneNumber: '82949238',
            email: 'maxxiuser@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
          },
          {
            id: 13,
            phoneNumber: '82949238',
            email: 'maxxiuser1@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
          },
          {
            id: 14,
            phoneNumber: '82949238',
            email: 'maxximizeAdmin@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
          },
          {
            id: 15,
            phoneNumber: '88880000',
            email: 'jiayinglim@live.com',
            address: 'Serangoon Gardens',
            postalCode: '789273',
          },
          {
            id: 16,
            phoneNumber: '88880000',
            email: 'e0540315@u.nus.edu',
            address: 'Serangoon Gardens',
            postalCode: '789273',
          },
          {
            id: 17,
            phoneNumber: '88880000',
            email: 'jiayinglim@live.com',
            address: 'Serangoon Gardens',
            postalCode: '789273',
          },
          {
            id: 18,
            phoneNumber: '88886546',
            email: 'jiayinglim@live.com',
            address: 'Serangoon Gardens',
            postalCode: '789273',
          },
        ])
        .execute();

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            id: 2,
            firstName: 'PregoSuperAdmin',
            lastName: 'Lee',
            username: 'pregosuperadmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.SUPERADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(10),
          },
          {
            id: 3,
            firstName: 'PregoAdmin',
            lastName: 'Lee',
            username: 'pregoadmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(11),
          },
          {
            id: 4,
            firstName: 'pregoManager',
            lastName: 'Lee',
            username: 'pregomanager',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.MANAGER,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(12),
          },
          {
            id: 5,
            firstName: 'maxximizeAdmin',
            lastName: 'Lee',
            username: 'maxximizeadmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(1),
            contact: await this.contactsService.findOne(13),
          },
          {
            id: 6,
            firstName: 'HDLAdmin',
            lastName: 'Lee',
            username: 'hdladmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(3),
            contact: await this.contactsService.findOne(14),
          },
          {
            id: 7,
            firstName: 'PregoDriver',
            lastName: 'Lee',
            username: 'pregodriver',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.DRIVER,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(15),
          },
          {
            id: 8,
            firstName: 'NissinManager',
            lastName: 'Lee',
            username: 'nissinmanager',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.MANAGER,
            organisation: await this.organisationsService.findOne(4),
            contact: await this.contactsService.findOne(16),
          },
          {
            id: 9,
            firstName: 'PregoDriver2',
            lastName: 'Lee',
            username: 'pregodriver2',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.DRIVER,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(17),
          },
          {
            id: 10,
            firstName: 'PregoFactoryWorker',
            lastName: 'Lee',
            username: 'pregofactoryworker',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.FACTORYWORKER,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(18),
          },
        ])
        .execute();

      await this.warehousesService.create({
        name: 'Warehouse 1',
        description: 'Warehouse 1 Description',
        address: 'Address for Warehouse 1',
        organisationId: 2,
      });

      await this.warehousesService.create({
        name: 'Warehouse 2',
        description: 'Warehouse 2 Description',
        address: 'Address for Warehouse 2',
        organisationId: 2,
      });

      await this.warehousesService.create({
        name: 'Warehouse 1',
        description: 'Warehouse 1 Description',
        address: 'Address for Warehouse 1',
        organisationId: 4,
      });

      await this.rackService.create({
        name: 'Rack 1',
        description: 'Rack 1 Warehouse 1',
        warehouseId: 1,
      });

      await this.rackService.create({
        name: 'Rack 2',
        description: 'Rack 2 Warehouse 1',
        warehouseId: 1,
      });

      await this.rackService.create({
        name: 'Rack 3',
        description: 'Rack 1 Warehouse 2',
        warehouseId: 2,
      });

      await this.rackService.create({
        name: 'Rack 1',
        description: 'Rack 1 Warehouse 1',
        warehouseId: 3,
      });

      await this.binsService.create({
        name: 'SLOC-001',
        volumetricSpace: 150000,
        rackId: 1,
      });

      await this.binsService.create({
        name: 'SLOC-002',
        volumetricSpace: 150000,
        rackId: 2,
      });

      await this.binsService.create({
        name: 'SLOC-001',
        volumetricSpace: 100000,
        rackId: 3,
      });

      await this.binsService.create({
        name: 'SLOC-001',
        volumetricSpace: 500000,
        rackId: 4,
      });

      //Raw material for Prego

      //1
      await this.rawMaterialsService.create({
        name: 'Red Tomato',
        description: 'Red and juicy Tomatoes, imported from Malaysia',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 5,
        expiry: 20,
        organisationId: 2,
      });

      //2
      await this.rawMaterialsService.create({
        name: 'Japanese Cucumbers',
        description: 'Fresh Cucumbers imported from Japan, Hokkaido',
        lotQuantity: 30,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 6,
        expiry: 25,
        organisationId: 2,
      });

      //3
      await this.rawMaterialsService.create({
        name: 'Yellow Tomato',
        description: 'Unripe Tomatoes, freshly grown in Singapore Farm',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 6,
        expiry: 20,
        organisationId: 2,
      });

      //4
      await this.rawMaterialsService.create({
        name: 'Cabbage',
        description: 'Fresh Cabbages from local markets',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 5,
        expiry: 20,
        organisationId: 2,
      });

      //5
      await this.rawMaterialsService.create({
        name: 'salt',
        description: 'pure salt harvested from East Coast Park',
        lotQuantity: 100,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 3,
        expiry: 100,
        organisationId: 2,
      });

      //Raw material for Nissin

      //6
      await this.rawMaterialsService.create({
        name: 'Preserved Small Tomatoes',
        description: 'preserved small tomatoes',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 20,
        expiry: 20,
        organisationId: 4,
      });

      //7
      await this.rawMaterialsService.create({
        name: 'Preserved Cucumbers',
        description: 'preserved cucumbers',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 25,
        expiry: 20,
        organisationId: 4,
      });

      //Final Good for Prego

      //8
      await this.finalGoodsService.create({
        name: 'Canned Mild Tomato',
        description: 'Canned Mild Tomato',
        lotQuantity: 20,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 50,
        expiry: 100,
        organisationId: 2,
      });

      //9
      await this.finalGoodsService.create({
        name: 'Canned Picked Cucumbers',
        description: 'Canned Picked Cucumbers',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 45,
        expiry: 100,
        organisationId: 2,
      });

      //10
      await this.finalGoodsService.create({
        name: 'Canned Pickles',
        description: 'Canned Pickles',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 40,
        expiry: 100,
        organisationId: 2,
      });

      //11
      await this.finalGoodsService.create({
        name: 'Canned Spicy Tomato',
        description: 'Canned Spicy Tomato',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 35,
        expiry: 100,
        organisationId: 2,
      });

      //12
      await this.finalGoodsService.create({
        name: 'Canned Sour Cabbage',
        description: 'Canned Sour Cabbage',
        lotQuantity: 30,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 35,
        expiry: 100,
        organisationId: 2,
      });

      //Final Good for Nissin

      //13
      await this.finalGoodsService.create({
        name: 'Tomato Noodles',
        description:
          'Tomato Noodles made with fresh ingredients, tangy and mild, perfect for a small snack!',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 45,
        expiry: 50,
        organisationId: 4,
      });

      //14
      await this.finalGoodsService.create({
        name: 'Sweet and Sour Noodles',
        description:
          'QQ noodles that is both sweet and sour, made with fresh tomatoes and pickles',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 45,
        expiry: 20,
        organisationId: 4,
      });

      //create BOMS for Prego

      //1
      await this.bomService.create({
        finalGoodId: 8,
        bomLineItemDtos: [
          {
            quantity: 5,
            rawMaterialId: 1,
          },
          {
            quantity: 3,
            rawMaterialId: 5,
          },
        ],
      });

      //2
      await this.bomService.create({
        finalGoodId: 9,
        bomLineItemDtos: [
          {
            quantity: 5,
            rawMaterialId: 2,
          },
          {
            quantity: 2,
            rawMaterialId: 5,
          },
        ],
      });

      //3
      await this.bomService.create({
        finalGoodId: 10,
        bomLineItemDtos: [
          {
            quantity: 5,
            rawMaterialId: 4,
          },
          {
            quantity: 2,
            rawMaterialId: 5,
          },
        ],
      });

      //4
      await this.bomService.create({
        finalGoodId: 11,
        bomLineItemDtos: [
          {
            quantity: 5,
            rawMaterialId: 3,
          },
          {
            quantity: 5,
            rawMaterialId: 5,
          },
        ],
      });

      //5
      await this.bomService.create({
        finalGoodId: 12,
        bomLineItemDtos: [
          {
            quantity: 3,
            rawMaterialId: 4,
          },
          {
            quantity: 4,
            rawMaterialId: 5,
          },
        ],
      });

      //create BOMS for Prego

      //6
      await this.bomService.create({
        finalGoodId: 13,
        bomLineItemDtos: [
          {
            quantity: 3,
            rawMaterialId: 6,
          },
        ],
      });

      //7
      await this.bomService.create({
        finalGoodId: 14,
        bomLineItemDtos: [
          {
            quantity: 3,
            rawMaterialId: 7,
          },
        ],
      });

      //Shell organisations for Prego 1 Supplier and 1 Retailer

      await this.shellOrganisationsService.create({
        name: 'Prego Supplier',
        uen: 'pregS-123',
        type: OrganisationType.SUPPLIER,
        contact: {
          phoneNumber: '123123123',
          email: 'maxximizetest@gmail.com',
          address: 'Yew Tee Lorong Chuan',
          postalCode: '123123',
        },
        organisationId: 2,
      });

      await this.shellOrganisationsService.create({
        name: 'Hai Di Lao',
        uen: 'HDL-12345',
        type: OrganisationType.RETAILER,
        contact: {
          phoneNumber: '123123123',
          email: 'maxximizetest@gmail.com',
          address: 'HarbourFront Station',
          postalCode: '123123',
        },
        organisationId: 2,
        creditLimit: 1000000000,
      });

      await this.shellOrganisationsService.create({
        name: 'WcDonalds',
        uen: 'WCD-12345',
        type: OrganisationType.RETAILER,
        contact: {
          phoneNumber: '93492347',
          email: 'wcdonalds@gmail.com',
          address: 'RetailAddress2',
          postalCode: '376839',
        },
        organisationId: 2,
        creditLimit: 1000000000,
      });

      await this.shellOrganisationsService.create({
        name: 'Burger Queen',
        uen: 'BGQ-12345',
        type: OrganisationType.RETAILER,
        contact: {
          phoneNumber: '90292348',
          email: 'burgerqueen@gmail.com',
          address: 'RetailAddress3',
          postalCode: '555839',
        },
        organisationId: 2,
        creditLimit: 1000000000,
      });

      await this.shellOrganisationsService.create({
        name: 'Tehtiam',
        uen: 'TEH-12345',
        type: OrganisationType.RETAILER,
        contact: {
          phoneNumber: '93402349',
          email: 'teh@gmail.com',
          address: 'RetailAddress4',
          postalCode: '371841',
        },
        organisationId: 2,
        creditLimit: 1000000000,
      });

      await this.shellOrganisationsService.create({
        name: 'Formosa',
        uen: 'FOR-12345',
        type: OrganisationType.RETAILER,
        contact: {
          phoneNumber: '93412348',
          email: 'formosa@gmail.com',
          address: 'RetailAddress5',
          postalCode: '471839',
        },
        organisationId: 2,
        creditLimit: 1000000000,
      });

      //create SI from Nissin to Nissin's supplier

      await this.salesInquiryService.create({
        currentOrganisationId: 2,
        totalPrice: 9600,
        salesInquiryLineItemsDtos: [
          {
            quantity: 400,
            indicativePrice: 5,
            rawMaterialId: 1,
          },
          {
            quantity: 400,
            indicativePrice: 6,
            rawMaterialId: 2,
          },
          {
            quantity: 200,
            indicativePrice: 6,
            rawMaterialId: 3,
          },
          {
            quantity: 500,
            indicativePrice: 5,
            rawMaterialId: 4,
          },
          {
            quantity: 500,
            indicativePrice: 3,
            rawMaterialId: 5,
          },
        ],
      });
      await this.salesInquiryService.sendEmail({
        salesInquiryId: 1,
        shellOrganisationIds: [1],
      });

      //create Quotation

      //1
      await this.quotationService.create({
        salesInquiryId: 1,
        shellOrganisationId: 1,
        leadTime: 5,
        currentOrganisationId: 2,
      });

      //create Quotation Line Item for above SI

      //1
      await this.quotationLineItemService.create({
        quantity: 400,
        price: 5,
        rawMaterialId: 1,
        quotationId: 1,
      });

      //2
      await this.quotationLineItemService.create({
        quantity: 400,
        price: 6,
        rawMaterialId: 2,
        quotationId: 1,
      });

      //3
      await this.quotationLineItemService.create({
        quantity: 200,
        price: 6,
        rawMaterialId: 3,
        quotationId: 1,
      });

      //4
      await this.quotationLineItemService.create({
        quantity: 500,
        price: 5,
        rawMaterialId: 4,
        quotationId: 1,
      });

      //5
      await this.quotationLineItemService.create({
        quantity: 500,
        price: 3,
        rawMaterialId: 5,
        quotationId: 1,
      });

      //create purchaseOrder
      const po = await this.purchaseOrderService.create({
        deliveryAddress: 'ManuAddress1',
        totalPrice: 9600,
        deliveryDate: new Date(),
        currentOrganisationId: 2,
        quotationId: 1,
        userContactId: 2,
        poLineItemDtos: [
          {
            quantity: 400,
            price: 5,
            rawMaterialId: 1,
          },
          {
            quantity: 400,
            price: 6,
            rawMaterialId: 2,
          },
          {
            quantity: 200,
            price: 6,
            rawMaterialId: 3,
          },
          {
            quantity: 500,
            price: 5,
            rawMaterialId: 4,
          },
          {
            quantity: 500,
            price: 3,
            rawMaterialId: 5,
          },
        ],
      });

      //create GR
      await this.goodsReceiptService.create({
        recipientId: 2,
        createdDateTime: new Date(),
        description: 'receive goods for data init',
        purchaseOrderId: 1,
        organisationId: 2,
        goodsReceiptLineItemsDtos: [
          {
            quantity: 400,
            rawMaterialId: 1,
            volumetricSpace: 130,
          },
          {
            quantity: 400,
            rawMaterialId: 2,
            volumetricSpace: 70,
          },
          {
            quantity: 200,
            rawMaterialId: 3,
            volumetricSpace: 140,
          },
          {
            quantity: 500,
            rawMaterialId: 4,
            volumetricSpace: 140,
          },
          {
            quantity: 500,
            rawMaterialId: 5,
            volumetricSpace: 140,
          },
        ],
        followUpLineItemsDtos: [],
      });

      console.log(po);

      await this.purchaseOrderService.update(1, {
        status: PurchaseOrderStatus.CLOSED,
      });

      //Factory Machine
      await this.factoryMachineService.create({
        serialNumber: 'TO123',
        description: 'Test machine 1',
        isOperating: true,
        make: 'IBM',
        model: 'Legacy',
        year: '2009',
        lastServiced: new Date('2022-09-19T16:33:47.000Z'),
        remarks: 'TESTER',
        organisationId: 2,
      });

      //ProductionLine
      await this.productionLineService.create({
        name: 'PL1',
        description: 'PL1',
        bomIds: [1, 2, 3, 4, 5],
        productionCostPerLot: 20,
        gracePeriod: 1800000,
        organisationId: 2,
        outputPerHour: 30,
        startTime: 9,
        endTime: 17,
        machineIds: [1],
      });

      await this.productionOrdersService.create({
        plannedQuantity: 5,
        bomId: 1,
        daily: false,
        organisationId: 2,
      });

      await this.schedulesService.allocate({
        orgId: 2,
        scheduleId: 1,
        quantity: 90,
        volumetricSpace: 900,
      });

      //Revenue brackets
      await this.revenueBracketsService.create({
        start: 1,
        end: 9999,
        commisionRate: 3,
      });
      await this.revenueBracketsService.create({
        start: 10000,
        end: 49999,
        commisionRate: 4,
      });
      await this.revenueBracketsService.create({
        start: 50000,
        end: null,
        commisionRate: 5,
      });

      //Membership
      await this.membershipService.create({
        organisationId: 2,
        customerId: 'cus_MnDRgcxCOYXY19',
      });

      await this.membershipService.create({
        organisationId: 4,
        customerId: 'cus_MnDS3VhLvWZ50w',
      });

      await this.membershipService.update(1, {
        subscriptionId: 'sub_1M3d4yHs54DYkQ2IpzPFPAEl',
        status: MembershipStatus.ACTIVE,
        plan: SubscriptionPlan.PRO,
        planAmount: 25,
        currentPeriodStart: new Date('2022-11-13T10:06:20.000Z'),
        currentPeriodEnd: new Date('2022-12-13T10:06:20.000Z'),
        commisionPayment: 'card_1M3d4oHs54DYkQ2IF2O5h0n7',
        defaultPayment: 'card_1M3d4oHs54DYkQ2IF2O5h0n7',
      });

      await this.membershipService.update(2, {
        subscriptionId: 'sub_1M3d4THs54DYkQ2InnhUmxsb',
        status: MembershipStatus.ACTIVE,
        plan: SubscriptionPlan.PRO,
        currentPeriodStart: new Date('2022-11-13T10:05:49.000Z'),
        currentPeriodEnd: new Date('2022-12-13T10:05:49.000Z'),
        planAmount: 25,
        commisionPayment: 'card_1M3d30Hs54DYkQ2Il1jp1wiW',
        defaultPayment: 'card_1M3d30Hs54DYkQ2Il1jp1wiW',
      });

      //create PO from HAIDILAO to PREGO
      let startCurrentQuantity = 300;
      const priceCurrent = 50;
      let currentDate = new Date();
      for (let i = 0; i < 7; i++) {
        await this.purchaseOrderService.create({
          deliveryAddress: 'warehouse 1',
          totalPrice: startCurrentQuantity * priceCurrent,
          deliveryDate: new Date(2022 - 10 - 11),
          currentOrganisationId: 3,
          supplierId: 2,
          userContactId: 8,
          poLineItemDtos: [
            {
              quantity: startCurrentQuantity,
              price: priceCurrent,
              finalGoodId: 8,
            },
          ],
        });

        await this.purchaseOrderService.update(i + 2, {
          status: PurchaseOrderStatus.ACCEPTED,
        });

        await this.purchaseOrderService.update(i + 2, {
          status: PurchaseOrderStatus.FULFILLED,
        });

        await this.invoiceService.update(i + 2, {
          status: InvoiceStatus.CLOSED,
          paymentReceived: currentDate,
        });
        currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        startCurrentQuantity -= (i + 1) * 10;
      }
      let currentLastYearDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      );
      let startQuantity = 200;
      const price = 50;
      for (let i = 0; i < 7; i++) {
        await this.purchaseOrderService.create({
          deliveryAddress: 'warehouse 1',
          totalPrice: startQuantity * price,
          deliveryDate: new Date(2022 - 10 - 11),
          currentOrganisationId: 3,
          supplierId: 2,
          userContactId: 8,
          poLineItemDtos: [
            {
              quantity: startQuantity,
              price: price,
              finalGoodId: 8,
            },
          ],
        });

        await this.purchaseOrderService.update(i + 7 + 2, {
          status: PurchaseOrderStatus.ACCEPTED,
        });

        await this.purchaseOrderService.update(i + 7 + 2, {
          status: PurchaseOrderStatus.FULFILLED,
        });

        await this.invoiceService.update(i + 7 + 2, {
          status: InvoiceStatus.CLOSED,
          paymentReceived: currentLastYearDate,
        });
        currentLastYearDate = new Date(
          currentLastYearDate.setDate(currentLastYearDate.getDate() - 1)
        );
        startQuantity -= (i + 1) * 5;
      }

      //create PO from WcDonald to PREGO
      await this.purchaseOrderService.create({
        deliveryAddress: 'warehouse 1',
        totalPrice: 2000,
        deliveryDate: new Date(2022 - 11 - 11),
        currentOrganisationId: 5,
        supplierId: 2,
        userContactId: 8,
        poLineItemDtos: [
          {
            quantity: 40,
            price: 50,
            finalGoodId: 9,
          },
        ],
      });

      await this.purchaseOrderService.update(16, {
        status: PurchaseOrderStatus.ACCEPTED,
      });

      await this.purchaseOrderService.update(16, {
        status: PurchaseOrderStatus.FULFILLED,
      });

      await this.invoiceService.update(16, {
        status: InvoiceStatus.CLOSED,
        paymentReceived: new Date(),
      });

      //create PO from BurgerQueen to PREGO
      await this.purchaseOrderService.create({
        deliveryAddress: 'warehouse 1',
        totalPrice: 1200,
        deliveryDate: new Date(2022 - 11 - 11),
        currentOrganisationId: 6,
        supplierId: 2,
        userContactId: 8,
        poLineItemDtos: [
          {
            quantity: 40,
            price: 30,
            finalGoodId: 10,
          },
        ],
      });

      await this.purchaseOrderService.update(17, {
        status: PurchaseOrderStatus.ACCEPTED,
      });

      await this.purchaseOrderService.update(17, {
        status: PurchaseOrderStatus.FULFILLED,
      });

      await this.invoiceService.update(17, {
        status: InvoiceStatus.CLOSED,
        paymentReceived: new Date(),
      });

      //create PO from Tehtiam to PREGO
      await this.purchaseOrderService.create({
        deliveryAddress: 'warehouse 1',
        totalPrice: 4000,
        deliveryDate: new Date(2022 - 11 - 11),
        currentOrganisationId: 7,
        supplierId: 2,
        userContactId: 8,
        poLineItemDtos: [
          {
            quantity: 40,
            price: 100,
            finalGoodId: 11,
          },
        ],
      });

      await this.purchaseOrderService.update(18, {
        status: PurchaseOrderStatus.ACCEPTED,
      });

      await this.purchaseOrderService.update(18, {
        status: PurchaseOrderStatus.FULFILLED,
      });

      await this.invoiceService.update(18, {
        status: InvoiceStatus.CLOSED,
        paymentReceived: new Date(),
      });

      //create PO from Formosa to PREGO
      await this.purchaseOrderService.create({
        deliveryAddress: 'warehouse 1',
        totalPrice: 1000,
        deliveryDate: new Date(2022 - 11 - 11),
        currentOrganisationId: 8,
        supplierId: 2,
        userContactId: 8,
        poLineItemDtos: [
          {
            quantity: 50,
            price: 20,
            finalGoodId: 12,
          },
        ],
      });

      await this.purchaseOrderService.update(19, {
        status: PurchaseOrderStatus.ACCEPTED,
      });

      await this.purchaseOrderService.update(19, {
        status: PurchaseOrderStatus.FULFILLED,
      });

      await this.invoiceService.update(19, {
        status: InvoiceStatus.CLOSED,
        paymentReceived: new Date(),
      });

      await this.accountInfosService.create({
        bankCode: '021',
        bankName: 'DBS',
        accountNumber: '1231231',
        organisationId: 2,
      });
    }
  }
}
