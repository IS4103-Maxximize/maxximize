import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { CreateShellOrganisationDto } from './dto/create-shell-organisation.dto';
import { UpdateShellOrganisationDto } from './dto/update-shell-organisation.dto';
import { ShellOrganisation } from './entities/shell-organisation.entity';

@Injectable()
export class ShellOrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationRepository: Repository<ShellOrganisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
  ) {}
  async create(createShellOrganisationDto: CreateShellOrganisationDto): Promise<ShellOrganisation> {
    const {name, contact, type, uen, organisationId} = createShellOrganisationDto
    let organisationToBeAdded: Organisation
    if (organisationId) {
      organisationToBeAdded = await this.organisationsRepository.findOneBy({id: organisationId})
    }
    //need to check if uen is already present
    const allShellUens = await this.retrieveAllUen()
    if (allShellUens.includes(uen) || organisationToBeAdded.uen === uen) {
      throw new NotFoundException('UEN already exists')
    }
    //contact is provided, save it into database first
    if (contact) {
      await this.contactsRepository.save(contact)
    }
    const newShellOrganisation = this.shellOrganisationRepository.create({
      name,
      created: new Date(),
      uen,
      type,
      contact: contact ?? null,
      organisation: organisationToBeAdded
    })
    return this.shellOrganisationRepository.save(newShellOrganisation)
  }

  findAll(): Promise<ShellOrganisation[]> {
    return this.shellOrganisationRepository.find({
      relations: {
        organisation: true,
        contact: true,
        quotations: true
      }
    })
  }

  findOne(id: number): Promise<ShellOrganisation> {
    try {
      return this.shellOrganisationRepository.findOne({
        where: {
          id
        }, relations: {
          organisation: true,
          contact: true,
          quotations: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`the shell organisation with id:${id} cannot be found!`)
    }
  }

  async retrieveAllUen(): Promise<String[]> {
    const allShellOrganisations = await this.findAll()
    const allUENs = allShellOrganisations.map(shell => shell.uen)
    return allUENs
  }

  async update(id: number, updateShellOrganisationDto: UpdateShellOrganisationDto) {
    try {
      //retrieve the shell organisation
      const shellOrganisation = await this.shellOrganisationRepository.findOne({where: {
        id
      }, relations: {
        contact: true,
        quotations: true
      }})
      const updateFieldsArray = Object.entries(updateShellOrganisationDto)
      for (let i = 0; i < updateFieldsArray.length; i++) {
        const [key, value] = updateFieldsArray[i]
        if (value) {
          if (key === 'contact') {
           shellOrganisation['contact'] = await this.retrieveUpdatedContact(shellOrganisation, value)
          } else if (key === 'quotations') {
            shellOrganisation['quotations'] = await this.retrieveUpdatedQuotations(shellOrganisation, value)
          } else if (key === 'organisation') {
            shellOrganisation['organisation'] = await this.retrieveOrganisation(value)
          } else {
            shellOrganisation[key] = value
          }
        }
      }
      return this.shellOrganisationRepository.save(shellOrganisation)
    } catch (error) {
      throw new NotFoundException(`the shell organisation with id:${id} cannot be found!`)
    }
      
  }

  async remove(id: number): Promise<ShellOrganisation> {
    const shellOrgToRemove = await this.shellOrganisationRepository.findOneBy({id})
    return this.shellOrganisationRepository.remove(shellOrgToRemove)
  }


  async removeSome(ids: number[]): Promise<ShellOrganisation[]> {
    const shellsToRemove = await Promise.all(ids.map(async id => {
      return await this.shellOrganisationRepository.findOneBy({id})
    }))
    return this.shellOrganisationRepository.remove(shellsToRemove)
  }

  async retrieveUpdatedContact(shellOrganisation: ShellOrganisation, contact: CreateContactDto): Promise<Contact> {
    const newContact = this.contactsRepository.create({
      id: shellOrganisation.contact.id ?? null,
      ...contact
    })
    return this.contactsRepository.save(newContact)
  }

  async retrieveUpdatedQuotations(shellOrganisation: ShellOrganisation, quotations: number[]) : Promise<Quotation[]> {
    const updatedQuotations = []
    const currentQuotations = shellOrganisation.quotations
    const arrayOfQuotationToBeDeleted = currentQuotations.filter(quotation => {
      return !quotations.includes(quotation.id)
    })
    await this.quotationsRepository.remove(arrayOfQuotationToBeDeleted)
    for (let i = 0; i < quotations.length; i++) {
      const quotation = await this.quotationsRepository.findOneBy({id: quotations[i]})
      updatedQuotations.push(quotation)
    }
    return updatedQuotations
  }

  async retrieveOrganisation(shellOrganisationId: number) : Promise<Organisation> {
    return this.organisationsRepository.findOneBy({id: shellOrganisationId})
  }
}
