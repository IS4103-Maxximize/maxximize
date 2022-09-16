import { Injectable } from '@nestjs/common';
import { OrganisationsService } from '../organisations/organisations.service';
import { UsersService } from '../users/users.service';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class AppService {
  constructor(private organisationsService: OrganisationsService,
    private usersService: UsersService) {}
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async dataInit() {
    const maxximize = await this.organisationsService.findOrganisationByType(OrganisationType.MAXXIMIZE)
    if (maxximize.length === 0) {
      const maxximizeOrg = await this.organisationsService.create({
        name: "MaxxiMize",
        type: OrganisationType.MAXXIMIZE,
        uen: "999999999",
        contact: {
          phoneNumber: "88880000",
          email: "maxximize@gmail.com",
          address: "Serangoon Gardens",
          postalCode: "789273"
        }
      })
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
        organisationId: maxximizeOrg.id
      })
    }
  }
}
