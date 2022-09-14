/* eslint-disable prefer-const */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { Contact } from '../contacts/entities/contact.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
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
    @InjectRepository(SalesInquiry)
    private readonly salesInquiriesRepository: Repository<SalesInquiry>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
  ) {}
  async create(createShellOrganisationDto: CreateShellOrganisationDto): Promise<ShellOrganisation> {
    const {name, type, uen, contact, organisationId} = createShellOrganisationDto
    let creatorToBeAdded: Organisation
    creatorToBeAdded = await this.organisationsRepository.findOneBy({id: organisationId})
    
    //contact is provided, save it into database first
    if (contact) {
      await this.contactsRepository.save(contact)
    }
    const newShellOrganisation = this.shellOrganisationRepository.create({
      name,
      type,
      created: new Date(),
      uen,
      contact: contact ?? null,
      creator: creatorToBeAdded,
      quotations: [],
      salesInquiries: [],
      rawMaterials: []
      
    })
    //need to check if uen is already present
    const allUens = await this.retrieveAllUen()
    if (allUens.includes(uen)) {
      let organisationToBeAdded: Organisation
      organisationToBeAdded = await this.organisationsRepository.findOneBy({uen: uen})
      newShellOrganisation.organisation = organisationToBeAdded
    }
    return this.shellOrganisationRepository.save(newShellOrganisation)
  }

  findAll(): Promise<ShellOrganisation[]> {
    return this.shellOrganisationRepository.find({
      relations: {
        creator: true
      }
    })
  }

  findOne(id: number): Promise<ShellOrganisation> {
    try {
      return this.shellOrganisationRepository.findOne({
        where: {
          id
        }, relations: {
          creator: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`the shell organisation with id:${id} cannot be found!`)
    }
  }

  async retrieveAllUen(): Promise<string[]> {
    const allOrganisations = await this.organisationsRepository.find({
      relations: {
        shellOrganisations: true,
        contact: true,
        users: true
      }
    })
    const allUENs = allOrganisations.map(org => org.uen)
    return allUENs
  }

  async update(id: number, updateShellOrganisationDto: UpdateShellOrganisationDto) {
    try {
      //retrieve the shell organisation
      const shellOrganisation = await this.shellOrganisationRepository.findOne({where: {
        id
      }, relations: {
        creator: true
      }})
      const updateFieldsArray = Object.entries(updateShellOrganisationDto)
      for (let i = 0; i < updateFieldsArray.length; i++) {
        const [key, value] = updateFieldsArray[i]
        if (value) {
          if (key === 'contact') {
           shellOrganisation['contact'] = await this.retrieveUpdatedContact(shellOrganisation, value)
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

  async addRawMaterial(shellOrganisationId: number, rawMaterialId: number): Promise<ShellOrganisation> {
    let shellOrganisation: ShellOrganisation
    shellOrganisation = await this.shellOrganisationRepository.findOneByOrFail({id: shellOrganisationId})
    let rawMaterial: RawMaterial
    rawMaterial = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterialId})
    shellOrganisation.rawMaterials.push(rawMaterial)
    return this.shellOrganisationRepository.save(shellOrganisation)
  }

  async removeRawMaterial(shellOrganisationId: number, rawMaterialId: number): Promise<ShellOrganisation> {
    let shellOrganisation: ShellOrganisation
    shellOrganisation = await this.shellOrganisationRepository.findOneByOrFail({id: shellOrganisationId})
    let rawMaterial: RawMaterial
    rawMaterial = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterialId})
    let index = shellOrganisation.rawMaterials.indexOf(rawMaterial)
    shellOrganisation.rawMaterials.splice(index, 1)
    return this.shellOrganisationRepository.save(shellOrganisation)
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

  /*async retrieveUpdatedQuotations(shellOrganisation: ShellOrganisation, quotations: number[]) : Promise<Quotation[]> {
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
  }*/

  async retrieveOrganisation(shellOrganisationUen: string) : Promise<Organisation> {
    return this.organisationsRepository.findOneBy({uen: shellOrganisationUen})
  }
}
