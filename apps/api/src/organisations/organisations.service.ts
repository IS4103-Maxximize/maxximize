/* eslint-disable prefer-const */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsernameAlreadyExistsException } from '../users/exceptions/UsernameAlreadyExistsException';
import { UsersService } from '../users/users.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { GetOrgByShellDto } from './dto/get-org-by-shell.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { OrganisationType } from './enums/organisationType.enum';
import { MailService } from '../mail/mail.service';
import { MembershipsService } from '../memberships/memberships.service';
import { AccountInfo } from '../account-info/entities/account-info.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private dataSource: DataSource,
    private mailService: MailService,
    @Inject(forwardRef(() => MembershipsService))
    private membershipService: MembershipsService
  ) {}

  async create(
    createOrganisationDto: CreateOrganisationDto
  ): Promise<Organisation> {
    const { name, type, contact, uen } = createOrganisationDto;
    const allUensOfRegisteredOrgs = await this.findAllUensOfRegisterdOrgs();
    if (allUensOfRegisteredOrgs.includes(uen)) {
      throw new NotFoundException(
        'UEN is used by an exisiting registed organisation!'
      );
    }
    if (contact) {
      await this.contactsRepository.save(contact);
    }
    const newOrganisation = this.organisationsRepository.create({
      name,
      type,
      uen,
      contact: contact ?? null,
    });
    return this.organisationsRepository.save(newOrganisation);
  }

  async registerOrganisationAndUser(
    createOrganisationDto: CreateOrganisationDto,
    createUserDto: CreateUserDto
  ): Promise<Organisation> {
    let organisation: Organisation;
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        //create the organisation
        const { name, type, contact, uen, accountInfo } = createOrganisationDto;
        const allUensOfRegisteredOrgs = await this.findAllUensOfRegisterdOrgs();
        if (allUensOfRegisteredOrgs.includes(uen)) {
          throw new NotFoundException(
            'UEN is used by an exisiting registed organisation!'
          );
        }
        let orgContact: Contact;
        if (contact) {
          orgContact = transactionalEntityManager.create(Contact, {
            ...contact,
          });
          await transactionalEntityManager.save(orgContact);
        }
        let orgAccountInfo: AccountInfo;
        if (accountInfo) {
          orgAccountInfo = transactionalEntityManager.create(AccountInfo, {
            ...accountInfo,
          });
          await transactionalEntityManager.save(orgAccountInfo);
        }
        organisation = transactionalEntityManager.create(Organisation, {
          name,
          type,
          uen,
          contact: orgContact ?? null,
          accountInfo: orgAccountInfo ?? null,
        });
        await transactionalEntityManager.save(organisation);
        //create the user

        //check if username is unique
        const user = await this.usersService.findByUsername(
          createUserDto.username
        );
        if (user != null) {
          throw new UsernameAlreadyExistsException(
            'Username: ' + createUserDto.username + ' already exists!'
          );
        }
        //check contact email whether its unique in user's organisation
        const allEmailsInOrganisation =
          await this.usersService.getAllEmailsInOrganisation(
            organisation,
            transactionalEntityManager
          );
        if (allEmailsInOrganisation.includes(createUserDto.contact.email)) {
          throw new NotFoundException(
            'Email is already being used by another user or the organisation you are in!'
          );
        }

        const {
          firstName,
          lastName,
          username,
          role,
          contact: newContact,
        } = createUserDto;
        let userContact: Contact;
        if (newContact) {
          userContact = transactionalEntityManager.create(Contact, {
            ...newContact,
          });
          await transactionalEntityManager.save(userContact);
        }

        const newUser = transactionalEntityManager.create(User, {
          firstName,
          lastName,
          username,
          role,
          contact: userContact,
        });
        const salt = await bcrypt.genSalt();
        newUser.salt = salt;
        const password = Math.random().toString(36).slice(-8);
        console.log(password);
        newUser.password = await bcrypt.hash(password, salt);

        newUser.organisation = organisation;
        await transactionalEntityManager.save(newUser);

        try {
          await this.mailService.sendPasswordEmail(
            createUserDto.contact.email,
            organisation.name,
            newUser,
            password,
            organisation.id
          );
        } catch (err) {
          throw new InternalServerErrorException(
            'Unable to send email successfully'
          );
        }
        return organisation;
      }
    );
    return this.findOne(organisation.id);
  }

  findAll(): Promise<Organisation[]> {
    return this.organisationsRepository.find({
      relations: {
        shellOrganisations: true,
        contact: true,
        users: true,
        accountInfo: true,
        membership: true,
      },
    });
  }

  async findOne(id: number): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOneOrFail({
        where: { id },
        relations: [
          'shellOrganisations',
          'contact',
          'users.contact',
          'membership',
          'accountInfo',
          'documents',
        ],
      });
      return organisation;
    } catch (err) {
      throw new NotFoundException(
        `findOne failed as Organization with id: ${id} cannot be found`
      );
    }
  }

  async findOrganisationsThatMatchesShellOrgUEN(dto: GetOrgByShellDto) {
    const { shellOrganisations } = dto;
    const organisations = [];
    for (const shellOrg of shellOrganisations) {
      const UEN = shellOrg.uen;
      const checkOrg = await this.organisationsRepository.findOne({
        where: {
          uen: UEN,
        },
        relations: {
          contact: true,
          finalGoods: true,
          rawMaterials: true,
          accountInfo: true,
        },
      });
      if (checkOrg) organisations.push(checkOrg);
    }
    return organisations;
  }

  async update(
    id: number,
    updateOrganisationDto: UpdateOrganisationDto
  ): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOneOrFail({
        where: {
          id,
        },
      });
      const keyValuePairs = Object.entries(updateOrganisationDto);
      for (let i = 0; i < keyValuePairs.length; i++) {
        const [key, value] = keyValuePairs[i];
        //fields in updateOrganisationDto are optional, so check if the value is present or null
        if (key === 'contact') {
          organisation['contact'] = await this.updateOrganisationContact(
            updateOrganisationDto.contact,
            organisation
          );
        } else {
          organisation[key] = value;
        }
      }
      return this.organisationsRepository.save(organisation);
    } catch (err) {
      throw new NotFoundException(
        `update Failed as Organization with id: ${id} cannot be found`
      );
    }
  }

  async findOrganisationWorkers(id: number): Promise<User[]> {
    return this.organisationsRepository
      .findOne({
        where: { id },
        relations: ['users', 'users.contact'],
      })
      .then((organisation) => organisation?.users);
  }

  async remove(id: number): Promise<Organisation> {
    try {
      const organisation = await this.findOne(id);
      return this.organisationsRepository.remove(organisation);
    } catch (err) {
      throw new NotFoundException(
        `Remove failed as Organization with id: ${id} cannot be found`
      );
    }
  }

  async findOrganisationByType(
    type: OrganisationType
  ): Promise<Organisation[]> {
    return this.organisationsRepository.findBy({ type: type });
  }

  async findAllUensOfRegisterdOrgs() {
    const allRegisterdOrgs = await this.organisationsRepository.find();
    const allUens = allRegisterdOrgs.map((org) => org.uen);
    return allUens;
  }

  async updateOrganisationContact(
    contact: CreateContactDto,
    organisation: Organisation
  ): Promise<Contact> {
    let contactToBeSaved = {};
    const currentOrg = await this.organisationsRepository.findOne({
      where: {
        id: organisation.id,
      },
      relations: {
        contact: true,
      },
    });

    contactToBeSaved = {
      id: currentOrg.contact.id ?? null,
      ...contact,
    };
    return this.contactsRepository.save(contactToBeSaved);
  }

  async directUpdate(organisation: Organisation) {
    return this.organisationsRepository.save(organisation);
  }

  async banOrganisation(organisationId: number) {
    const organisationToBan = await this.findOne(organisationId);
    //stop the membership first
    // const membership = organisationToBan.membership
    // const {subscriptionId} = membership
    if (organisationToBan.membership?.subscriptionId) {
      await this.membershipService.pauseSubscription(
        organisationToBan.membership.subscriptionId
      );
    }
    //set isActive to false
    return this.update(organisationId, { isActive: false });
  }

  async unbanOrganisation(organisationId: number) {
    const organisationToBan = await this.findOne(organisationId);
    //stop the membership first
    if (organisationToBan.membership?.subscriptionId) {
      await this.membershipService.resumeSubscription(
        organisationToBan.membership.subscriptionId
      );
    }
    //set isActive to true
    return this.update(organisationId, { isActive: true });
  }

  async findOrgByEmail(email: string): Promise<Organisation> {
    return this.organisationsRepository.findOne({
      where: {
        contact: {
          email: email,
        },
      },
      relations: {
        membership: true,
      },
    });
  }
}
