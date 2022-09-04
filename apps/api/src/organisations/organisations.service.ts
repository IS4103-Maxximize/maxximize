import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
  ) {}

  async create(createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    const {name, type, contact} = createOrganisationDto
    if (contact) {
      await this.contactsRepository.save(contact)
    }
    const newOrganisation = this.organisationsRepository.create({
      name,
      type,
      users: [],
      contact: contact ?? null
    })
    return this.organisationsRepository.save(newOrganisation);
  }

  findAll(): Promise<Organisation[]> {
    return this.organisationsRepository.find({
      relations: {
        customers: true,
        suppliers: true,
        contact: true
      }
    });
  }

  async findOne(id: number): Promise<Organisation> {
    try {
      const organisation =  await this.organisationsRepository.findOne({where: {
        id
      }, relations: {
        customers: true,
        suppliers: true,
        contact: true
      }})
      return organisation
    } catch (err) {
      throw new NotFoundException(`findOne failed as Organization with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateOrganisationDto: UpdateOrganisationDto): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateOrganisationDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        //fields in updateOrganisationDto are optional, so check if the value is present or null
        if (value) {
          if (key === 'suppliers') {
            organisation['suppliers'] = await this.retrieveOrganisations(updateOrganisationDto.suppliers)
          } else if (key === 'customers') {
            organisation['customers'] = await this.retrieveOrganisations(updateOrganisationDto.customers)
          } else if (key === 'contact') {
            organisation['contact'] = await this.updateContact(updateOrganisationDto.contact, organisation)
          } else {
            organisation[key] = value
          }
        }
      }
      return this.organisationsRepository.save(organisation)
    } catch (err) {
      throw new NotFoundException(`update Failed as Organization with id: ${id} cannot be found`)
    }
  }

  findOrganisationWorkers(id: number): Promise<User[]> {
    return this.findOne(id).then((organisation) => organisation.users);
  }

  async remove(id: number): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOneBy({id})
      return this.organisationsRepository.remove(organisation);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Organization with id: ${id} cannot be found`)
    }
  }

  async retrieveOrganisations(ids: number[]): Promise<Organisation[]> {
    const result = []
    for (let i = 0; i < ids.length; i++) {
      result.push(await this.organisationsRepository.findOne({
        where: {
          id: ids[i]
        }
      }))
    }
    return result
  }

  async updateContact(contact: CreateContactDto, organisation: Organisation): Promise<Contact> {
    let contactToBeSaved = {}
    const currentOrg = await this.organisationsRepository.findOne({where: {
      id: organisation.id
    }, relations: {
      contact: true
    }})
    //contact is already present
    if (currentOrg.contact) {
      contactToBeSaved = {
        id: currentOrg.contact.id,
        ...contact
      }
    //contact is new
    } else {
      contactToBeSaved = contact
    }
    return this.contactsRepository.save(contactToBeSaved)
  }

  async directUpdate(organisation: Organisation) {
    return this.organisationsRepository.save(organisation);
  }
}
