/* eslint-disable prefer-const */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { Repository } from 'typeorm';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { CreateShellOrganisationDto } from './dto/create-shell-organisation.dto';
import { UpdateShellOrganisationDto } from './dto/update-shell-organisation.dto';
import { ShellOrganisation } from './entities/shell-organisation.entity';
import { OrganisationType } from "../organisations/enums/organisationType.enum";

@Injectable()
export class ShellOrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationRepository: Repository<ShellOrganisation>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>
  ) {}
  async create(
    createShellOrganisationDto: CreateShellOrganisationDto
  ): Promise<ShellOrganisation> {
    const {
      name,
      type,
      uen,
      contact,
      organisationId,
      currentCredit,
      creditLimit,
    } = createShellOrganisationDto;
    let parentOrganisation: Organisation;
    parentOrganisation = await this.organisationsRepository.findOneBy({
      id: organisationId,
    });

    const UensToCheck = await this.retrieveUensInParentOrg(organisationId);
    if (UensToCheck.includes(uen)) {
      throw new NotFoundException(
        'UEN already exists within your organisation!'
      );
    }

    //contact is provided, save it into database first
    if (contact) {
      await this.contactsRepository.save(contact);
    }
    const newShellOrganisation = this.shellOrganisationRepository.create({
      name,
      type,
      created: new Date(),
      uen,
      contact: contact ?? null,
      parentOrganisation: parentOrganisation,
      currentCredit: currentCredit ?? 0,
      creditLimit: creditLimit ?? null,
    });

    return this.shellOrganisationRepository.save(newShellOrganisation);
  }

  findAll(): Promise<ShellOrganisation[]> {
    return this.shellOrganisationRepository.find({
      relations: {
        parentOrganisation: true,
        contact: true,
      },
    });
  }

  async findOne(id: number): Promise<ShellOrganisation> {
    try {
      return await this.shellOrganisationRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          parentOrganisation: true,
          contact: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `the shell organisation with id:${id} cannot be found!`
      );
    }
  }

  async findAllByOrg(id: number) {
    return this.shellOrganisationRepository.find({
      where: {
        parentOrganisationId: id,
      },
      relations: {
        contact: true,
      },
    });
  }

  async findAllRetailersByOrg(id: number){
    return this.shellOrganisationRepository.find({
      where: {
        parentOrganisationId: id,
        type: OrganisationType.RETAILER
      },
      relations: {
        contact: true,
      },
    });
  }

  async retrieveUensInParentOrg(parentOrgId: number): Promise<string[]> {
    const parentOrg = await this.organisationsRepository.findOne({
      where: { id: parentOrgId },
      relations: {
        shellOrganisations: true,
      },
    });
    const shellOrgs = parentOrg.shellOrganisations;
    const allUENs = shellOrgs.map((org) => org.uen);
    return [...allUENs, parentOrg.uen];
  }

  async retrieveShellOrgFromUen(organisationId: number, uen: string) {
    const parentOrg = await this.organisationsRepository.findOne({
      where: { id: organisationId },
      relations: {
        shellOrganisations: true,
      },
    });
    const shellOrgs = parentOrg.shellOrganisations;
    for (const shellOrg of shellOrgs) {
      if (uen == shellOrg.uen) {
        return this.findOne(shellOrg.id);
      }
    }
    return null;
  }

  async update(
    id: number,
    updateShellOrganisationDto: UpdateShellOrganisationDto
  ) {
    try {
      //retrieve the shell organisation
      const shellOrganisation =
        await this.shellOrganisationRepository.findOneOrFail({
          where: {
            id: id,
          },
          relations: {
            parentOrganisation: true,
            contact: true,
          },
        });
      const updateFieldsArray = Object.entries(updateShellOrganisationDto);
      for (let i = 0; i < updateFieldsArray.length; i++) {
        const [key, value] = updateFieldsArray[i];
        if (value) {
          if (key === 'contact') {
            shellOrganisation['contact'] = await this.retrieveUpdatedContact(
              shellOrganisation,
              value
            );
          } else if (key === 'rawMaterials') {
            shellOrganisation['rawMaterials'] = await this.retrieveRawMaterials(
              value
            );
          } else {
            shellOrganisation[key] = value;
          }
        }
      }
      return this.shellOrganisationRepository.save(shellOrganisation);
    } catch (error) {
      throw new NotFoundException(
        `the shell organisation with id:${id} cannot be found!`
      );
    }
  }

  async remove(id: number): Promise<ShellOrganisation> {
    const shellOrgToRemove = await this.shellOrganisationRepository.findOneBy({
      id,
    });
    return this.shellOrganisationRepository.remove(shellOrgToRemove);
  }

  async retrieveUpdatedContact(
    shellOrganisation: ShellOrganisation,
    contact: CreateContactDto
  ): Promise<Contact> {
    const newContact = this.contactsRepository.create({
      id: shellOrganisation.contact?.id ?? null,
      ...contact,
    });
    return this.contactsRepository.save(newContact);
  }

  async retrieveRawMaterials(
    rawMaterialsIds: number[]
  ): Promise<RawMaterial[]> {
    const listOfRawMaterials = rawMaterialsIds.map(async (rawMaterialId) => {
      return await this.rawMaterialsRepository.findOneBy({ id: rawMaterialId });
    });
    return Promise.all(listOfRawMaterials);
  }

  async getNewCustomersByMonth(organisationId: number) {
    const start = dayjs().startOf('month').toDate();
    const end = dayjs().endOf('month').toDate();

    const prevStart = dayjs().startOf('month').subtract(1, 'month').toDate();
    const prevEnd = dayjs().endOf('month').subtract(1, 'month').toDate();

    const count = await this.shellOrganisationRepository
      .createQueryBuilder('shell_organisation')
      .where('shell_organisation.created BETWEEN :start AND :end', {
        start: start,
        end: end,
      })
      .andWhere('shell_organisation.type = :type', { type: 'retailer' })
      .getCount();

    const prevCount = await this.shellOrganisationRepository
      .createQueryBuilder('shell_organisation')
      .where('shell_organisation.created BETWEEN :start AND :end', {
        start: prevStart,
        end: prevEnd,
      })
      .andWhere('shell_organisation.type = :type', { type: 'retailer' })
      .getCount();
    
    if (prevCount === 0) {
      return {
        "count": count,
        "pct_change": count * 100
      }
    } else {
      return {
        "count": count,
        "pct_change": Math.round((count - prevCount / prevCount) + Number.EPSILON * 100) / 100
      }
    }
  }
}
