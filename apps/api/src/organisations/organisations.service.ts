/* eslint-disable prefer-const */
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
    private readonly contactsRepository: Repository<Contact>
  ) {}

  async create(createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    const {name, type, contact, uen} = createOrganisationDto
    const allUensOfRegisteredOrgs = await this.findAllUensOfRegisterdOrgs()
    if (allUensOfRegisteredOrgs.includes(uen)) {
      throw new NotFoundException('UEN is used by an exisiting registed organisation!')
    }
    if (contact) {
      await this.contactsRepository.save(contact)
    }
    const newOrganisation = this.organisationsRepository.create({
      name,
      type,
      uen,
      contact: contact ?? null,
    })
    return this.organisationsRepository.save(newOrganisation);
  }

  findAll(): Promise<Organisation[]> {
    return this.organisationsRepository.find({
      relations: {
        shellOrganisations: true,
        contact: true,
        users: true
      }
    });
  }

  async findOne(id: number): Promise<Organisation> {
    try {
      const organisation =  await this.organisationsRepository.findOne({where: {
        id
      }, relations: {
        shellOrganisations: true,
        contact: true,
        users: true
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
        const [key, value] = keyValuePairs[i]
        //fields in updateOrganisationDto are optional, so check if the value is present or null
        if (value) {
          if (key === 'contact') {
            organisation['contact'] = await this.updateOrganisationContact(updateOrganisationDto.contact, organisation)
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

  async findOrganisationWorkers(id: number): Promise<User[]> {
    return this.organisationsRepository.findOne({
      where: {id},
      relations: ["users", "users.contact"]
    }).then((organisation) => organisation?.users);
  }

  async remove(id: number): Promise<Organisation> {
    try {
      const organisation = await this.organisationsRepository.findOneBy({id})
      return this.organisationsRepository.remove(organisation);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Organization with id: ${id} cannot be found`)
    }
  }

  async findAllUensOfRegisterdOrgs() {
    const allRegisterdOrgs = await this.organisationsRepository.find()
    const allUens = allRegisterdOrgs.map(org => org.uen)
    return allUens
  }


  async updateOrganisationContact(contact: CreateContactDto, organisation: Organisation): Promise<Contact> {
    let contactToBeSaved = {}
    const currentOrg = await this.organisationsRepository.findOne({where: {
      id: organisation.id
    }, relations: {
      contact: true
    }})
    
    contactToBeSaved = {
      id: currentOrg.contact.id ?? null,
      ...contact
    }
    return this.contactsRepository.save(contactToBeSaved)
    
  }

  async directUpdate(organisation: Organisation) {
    return this.organisationsRepository.save(organisation);
  }

}
