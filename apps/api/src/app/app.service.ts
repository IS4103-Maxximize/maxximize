import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { BinsService } from '../bins/bins.service';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { GoodsReceiptsService } from '../goods-receipts/goods-receipts.service';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { QuotationLineItemsService } from '../quotation-line-items/quotation-line-items.service';
import { QuotationsService } from '../quotations/quotations.service';
import { RacksService } from '../racks/racks.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
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
    private dataSource: DataSource
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
        name: 'manufacturing1',
        type: OrganisationType.MANUFACTURER,
        uen: '124233122',
        contact: {
          phoneNumber: '94893849',
          email: 'm1@gmail.com',
          address: 'ManuAddress1',
          postalCode: '723123',
        },
      });

      await this.organisationsService.create({
        name: 'retailer1',
        type: OrganisationType.RETAILER,
        uen: '612763873',
        contact: {
          phoneNumber: '93492348',
          email: 'r1@gmail.com',
          address: 'RetailAddress1',
          postalCode: '371839',
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
            id: 5,
            phoneNumber: '93894938',
            email: 'mc1@gmail.com',
            address: 'ManuCusAddress1',
            postalCode: '423423',
          },
          {
            id: 6,
            phoneNumber: '92390489',
            email: 'rc1@gmail.com',
            address: 'RetailCusAddress1',
            postalCode: '534523',
          },
          {
            id: 7,
            phoneNumber: '82949238',
            email: 'maxxiuser@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
          },
          {
            id: 8,
            phoneNumber: '82949238',
            email: 'maxxiuser1@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
          },
          {
            id: 9,
            phoneNumber: '82949238',
            email: 'maxximizeAdmin@gmail.com',
            address: 'maxximiseAddress',
            postalCode: '839849',
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
            firstName: 'manuUser1',
            lastName: 'lee',
            username: 'manuSuperAdmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.SUPERADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(5),
          },
          {
            id: 3,
            firstName: 'retailUser1',
            lastName: 'tan',
            username: 'retailAdmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(6),
          },
          {
            id: 4,
            firstName: 'adminUser1',
            lastName: 'lim',
            username: 'maxximizeAdmin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(7),
          },
          {
            id: 5,
            firstName: 'manager1',
            lastName: 'lim',
            username: 'manager1',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.MANAGER,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(8),
          },
          {
            id: 6,
            firstName: 'admin',
            lastName: 'lim',
            username: 'admin',
            password:
              '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
            isActive: 'true',
            salt: '$2b$10$f6h95DOKlOa4967NYpF4y.',
            passwordChanged: true,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(1),
            contact: await this.contactsService.findOne(9),
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

      await this.rackService.create({
        name: "Rack 1",
        description: "Rack 1 Warehouse 1",
        warehouseId: 1
      });

      await this.rackService.create({
        name: "Rack 2",
        description: "Rack 2 Warehouse 1",
        warehouseId: 1
      });

      await this.rackService.create({
        name: "Rack 3",
        description: "Rack 1 Warehouse 2",
        warehouseId: 2
      });



      await this.binsService.create({
        name: 'SLOC-001-Warehouse1',
        capacity: 1000000,
        rackId: 1,
      });

      await this.binsService.create({
        name: 'SLOC-002-Warehouse1',
        capacity: 1000000,
        rackId: 2,
      });

      await this.binsService.create({
        name: 'SLOC-001-Warehouse2',
        capacity: 10000,
        rackId: 3,
      });

      await this.rawMaterialsService.create({
        name: 'Tomato',
        description: 'Fresh Tomato',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 10,
        expiry: 7,
        organisationId: 2,
      });

      await this.rawMaterialsService.create({
        name: 'Cabbage',
        description: 'Fresh Cabbage',
        lotQuantity: 50,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 5,
        expiry: 6,
        organisationId: 2,
      });

      await this.rawMaterialsService.create({
        name: 'Olive Oil',
        description: 'Extra Virgin Olive Oil',
        lotQuantity: 50,
        unit: MeasurementUnit.LITRE,
        unitPrice: 20,
        expiry: 60,
        organisationId: 2,
      });

      await this.finalGoodsService.create({
        name: 'Salad',
        description: 'Fresh Cabbage Salad drizzled with olive oil',
        lotQuantity: 20,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 50,
        expiry: 10,
        organisationId: 2,
      });

      await this.finalGoodsService.create({
        name: 'Tomatoes Canned',
        description: 'Canned Tomatoes in olive oil',
        lotQuantity: 40,
        unit: MeasurementUnit.KILOGRAM,
        unitPrice: 45,
        expiry: 150,
        organisationId: 2,
      });

      await this.shellOrganisationsService.create({
        name: 'Tomato Farm Bali',
        uen: '123TOM123',
        type: OrganisationType.SUPPLIER,
        contact: {
          phoneNumber: '123123123',
          email: 'maxximizetest@gmail.com',
          address: 'Tomato Farm Road 123',
          postalCode: '123123',
        },
        organisationId: 2,
      });

      await this.shellOrganisationsService.create({
        name: 'Olive Oil Vineyard 23',
        uen: '23OIL23',
        type: OrganisationType.SUPPLIER,
        contact: {
          phoneNumber: '2323232323',
          email: 'maxximizetest@gmail.com',
          address: '233 Olive Avenue Italy',
          postalCode: '233233',
        },
        organisationId: 2,
      });

      //create SI and update suppliers
      await this.salesInquiryService.create({
        currentOrganisationId: 2,
        totalPrice: 1850,
        salesInquiryLineItemsDtos: [
          {
            quantity: 50,
            indicativePrice: 10,
            rawMaterialId: 1,
          },
          {
            quantity: 30,
            indicativePrice: 5,
            rawMaterialId: 2,
          },
          {
            quantity: 60,
            indicativePrice: 20,
            rawMaterialId: 3,
          },
        ],
      });
	  await this.salesInquiryService.sendEmail({
		salesInquiryId: 1,
		shellOrganisationIds: [1]
	  })
    //   const supplier: ShellOrganisation =
    //     await this.shellOrganisationsService.findOne(1);
    //   await this.salesInquiryService.update(1, {
    //     suppliers: [supplier],
    //     salesInquiryLineItemsDtos: [
    //       {
    //         quantity: 50,
    //         indicativePrice: 10,
    //         rawMaterialId: 1,
    //       },
    //       {
    //         quantity: 30,
    //         indicativePrice: 5,
    //         rawMaterialId: 2,
    //       },
    //       {
    //         quantity: 60,
    //         indicativePrice: 20,
    //         rawMaterialId: 3,
    //       },
    //     ],
    //   });

      //create Quotation
      await this.quotationService.create({
        salesInquiryId: 1,
        shellOrganisationId: 1,
        leadTime: 5,
        currentOrganisationId: 2
      });

      //create Quotation Line Item

      await this.quotationLineItemService.create({
        quantity: 50,
        price: 10,
        rawMaterialId: 1,
        quotationId: 1,
      });

      await this.quotationLineItemService.create({
        quantity: 30,
        price: 5,
        rawMaterialId: 2,
        quotationId: 1,
      });

      await this.quotationLineItemService.create({
        quantity: 60,
        price: 20,
        rawMaterialId: 3,
        quotationId: 1,
      });

      //create purchaseOrder
      await this.purchaseOrderService.create({
        deliveryAddress: 'ManuAddress1',
        totalPrice: 1850,
        deliveryDate: new Date(),
        currentOrganisationId: 2,
        quotationId: 1,
        userContactId: 2,
        poLineItemDtos: [
          {
            quantity: 50,
            price: 10,
            rawMaterialId: 1,
          },
          {
            quantity: 30,
            price: 5,
            rawMaterialId: 2,
          },
          {
            quantity: 60,
            price: 20,
            rawMaterialId: 3,
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
            quantity: 50,
            rawMaterialId: 1,
          },
          {
            quantity: 30,
            rawMaterialId: 2,
          },
          {
            quantity: 60,
            rawMaterialId: 3,
          },
        ],
        followUpLineItemsDtos: [],
      });
    }
  }  
}
