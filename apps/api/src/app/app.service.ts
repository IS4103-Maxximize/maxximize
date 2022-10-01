import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from "typeorm";
import { BinsService } from '../bins/bins.service';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
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
    private dataSource: DataSource
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async onApplicationBootstrap() {
    const maxximize = await this.organisationsService.findOrganisationByType(OrganisationType.MAXXIMIZE)
    if (maxximize.length === 0) {
      await this.organisationsService.create({
        name: "MaxxiMize",
        type: OrganisationType.MAXXIMIZE,
        uen: "999999999",
        contact: {
          phoneNumber: "88880000",
          email: "maxximize@gmail.com",
          address: "Serangoon Gardens",
          postalCode: "789273"
        }
      });

      await this.organisationsService.create({
        name: "manufacturing1",
        type: OrganisationType.MANUFACTURER,
        uen: "124233122",
        contact: {
          phoneNumber: "94893849",
          email: "m1@gmail.com",
          address: "ManuAddress1",
          postalCode: "723123"
        }
      });

      await this.organisationsService.create({
        name: "retailer1",
        type: OrganisationType.RETAILER,
        uen: "612763873",
        contact: {
          phoneNumber: "93492348",
          email: "r1@gmail.com",
          address: "RetailAddress1",
          postalCode: "371839"
        }
      });

      await this.usersService.create({
        firstName: 'Max',
        lastName: 'Admin',
        role: Role.ADMIN,
        contact: {
          phoneNumber: "88880000",
          email: "maxximize4103@gmail.com",
          address: "Serangoon Gardens",
          postalCode: "789273",

        },
        username: 'maxadmin',
        organisationId: 1
      });

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Contact)
        .values([
          {
            id: 5,
            phoneNumber: "93894938",
            email: "mc1@gmail.com",
            address: "ManuCusAddress1",
            postalCode: "423423"
          },
          {
            id: 6,
            phoneNumber: "92390489",
            email: "rc1@gmail.com",
            address: "RetailCusAddress1",
            postalCode: "534523"
          },
          {
            id: 7,
            phoneNumber: "82949238",
            email: "maxxiuser@gmail.com",
            address: "maxximiseAddress",
            postalCode: "839849"
          }
        ]).execute();

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            id: 2,
            firstName: "manuUser1",
            lastName: "lee",
            username: "manuSuperAdmin",
            password: "$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K",
            isActive: "true",
            salt: "$2b$10$f6h95DOKlOa4967NYpF4y.",
            passwordChanged: false,
            role: Role.SUPERADMIN,
            organisation: await this.organisationsService.findOne(2),
            contact: await this.contactsService.findOne(5)
          },
          {
            id: 3,
            firstName: "retailUser1",
            lastName: "tan",
            username: "retailAdmin",
            password: "$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K",
            isActive: "true",
            salt: "$2b$10$f6h95DOKlOa4967NYpF4y.",
            passwordChanged: false,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(3),
            contact: await this.contactsService.findOne(6)
          },
          {
            id: 4,
            firstName: "adminUser1",
            lastName: "lim",
            username: "maxximizeAdmin",
            password: "$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K",
            isActive: "true",
            salt: "$2b$10$f6h95DOKlOa4967NYpF4y.",
            passwordChanged: false,
            role: Role.ADMIN,
            organisation: await this.organisationsService.findOne(1),
            contact: await this.contactsService.findOne(7)
          }
        ]).execute();

        await this.warehousesService.create({
          name: "Warehouse 1",
          description: "Warehouse 1 Description",
          address: "Address for Warehouse 1",
          organisationId: 2
        });

        await this.warehousesService.create({
          name: "Warehouse 2",
          description: "Warehouse 2 Description",
          address: "Address for Warehouse 2",
          organisationId: 2
        });

        await this.binsService.create({
          name: "SLOC-001-Warehouse1",
          capacity: 10000,
          warehouseId: 1
        });

        await this.binsService.create({
          name: "SLOC-002-Warehouse1",
          capacity: 10000,
          warehouseId: 1
        });

        await this.binsService.create({
          name: "SLOC-001-Warehouse2",
          capacity: 10000,
          warehouseId: 2
        });

        await this.rawMaterialsService.create({
          name: "Tomato",
          description: "Fresh Tomato",
          lotQuantity: 50,
          unit: MeasurementUnit.KILOGRAM,
          unitPrice: 10,
          expiry: 5,
          organisationId: 1
        });

        await this.rawMaterialsService.create({
          name: "Cababge",
          description: "Fresh Cabbage",
          lotQuantity: 50,
          unit: MeasurementUnit.KILOGRAM,
          unitPrice: 5,
          expiry: 2,
          organisationId: 1
        });

        await this.rawMaterialsService.create({
          name: "Olive Oil",
          description: "Extra Virgin Olive Oil",
          lotQuantity: 50,
          unit: MeasurementUnit.LITRE,
          unitPrice: 20,
          expiry: 60,
          organisationId: 1
        });

        await this.finalGoodsService.create({
          name: "Salad",
          description: "Fresh Cabbage Salad drizzled with olive oil",
          lotQuantity: 20,
          unit: MeasurementUnit.KILOGRAM,
          unitPrice: 50,
          expiry: 10,
          organisationId: 1
        });

        await this.finalGoodsService.create({
          name: "Tomatoes Canned",
          description: "Canned Tomatoes in olive oil",
          lotQuantity: 40,
          unit: MeasurementUnit.KILOGRAM,
          unitPrice: 45,
          expiry: 150,
          organisationId: 1
        });

        await this.shellOrganisationsService.create({
          name: "Tomato Farm Bali",
          uen: "123TOM123",
          type: OrganisationType.SUPPLIER,
          contact: {
            phoneNumber: "123123123",
            email: "maxximizetest@gmail.com",
            address: "Tomato Farm Road 123",
            postalCode: "123123"
          },
          organisationId: 1
        });

        await this.shellOrganisationsService.create({
          name: "Olive Oil Vineyard 23",
          uen: "23OIL23",
          type: OrganisationType.SUPPLIER,
          contact: {
            phoneNumber: "2323232323",
            email: "maxximizetest@gmail.com",
            address: "233 Olive Avenue Italy",
            postalCode: "233233"
          },
          organisationId: 1
        })
    }
  }
}
