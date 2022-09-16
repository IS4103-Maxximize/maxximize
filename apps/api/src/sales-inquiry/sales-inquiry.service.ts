/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../contacts/entities/contact.entity';
import { MailService } from '../mail/mail.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryLineItem } from '../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { AddSupplierDto } from './dto/add-supplier.dto';
import { CreateSalesInquiryDto } from './dto/create-sales-inquiry.dto';
import { UpdateSalesInquiryDto } from './dto/update-sales-inquiry.dto';
import { SalesInquiry } from './entities/sales-inquiry.entity';
import { SalesInquiryStatus } from './enums/salesInquiryStatus.enum';

@Injectable()
export class SalesInquiryService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(SalesInquiry)
    private readonly salesInquiriesRepository: Repository<SalesInquiry>,
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationsRepository: Repository<ShellOrganisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @InjectRepository(SalesInquiryLineItem)
    private readonly salesInquiryLineItemsRepository: Repository<SalesInquiryLineItem>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    private mailerService: MailService
  ) {}

  async create(createSalesInquiryDto: CreateSalesInquiryDto): Promise<SalesInquiry> {
    try {
      const { currentOrganisationId, totalPrice } = createSalesInquiryDto;
      let organisationToBeAdded: Organisation;
      organisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: currentOrganisationId});
      const salesInquiryLineItems = [];

      for (const dto of createSalesInquiryDto.salesInquiryLineItemsDtos) {
        const salesInquiryLineItem = new SalesInquiryLineItem();
        salesInquiryLineItem.quantity = dto.quantity;
        salesInquiryLineItem.rawMaterial = await this.rawMaterialsRepository.findOne({
          where: {
            id: dto.rawMaterialId
          }
        });
        salesInquiryLineItem.indicativePrice = dto.indicativePrice;
        salesInquiryLineItems.push(salesInquiryLineItem);
      }

      const newSalesInquiry = this.salesInquiriesRepository.create({
        status: SalesInquiryStatus.DRAFT,
        totalPrice: totalPrice,
        created: new Date(),
        currentOrganisation: organisationToBeAdded,
        salesInquiryLineItems: salesInquiryLineItems
      })
      return this.salesInquiriesRepository.save(newSalesInquiry)
    } catch (error) {
      throw new NotFoundException('either product code or Shell org id cannot be found')
    }
  }

  findAll(): Promise<SalesInquiry[]> {
    return this.salesInquiriesRepository.find({
      relations: {
        currentOrganisation: true,
        suppliers: true,
        quotations: true,
        salesInquiryLineItems: true
      }
    })
  }

  async findAllByOrg(organisationId: number): Promise<SalesInquiry[]> {
    return this.salesInquiriesRepository.find({
      where: {
        currentOrganisation: await this.organisationsRepository.findOneByOrFail({id: organisationId})
      },
      relations: {
        currentOrganisation: true,
        suppliers: true,
        quotations: true,
        salesInquiryLineItems: true
      }
    })
  }

  findOne(id: number): Promise<SalesInquiry> {
    return this.salesInquiriesRepository.findOne({where: {
      id
    }, relations: [
      "currentOrganisation",
      "suppliers",
      "quotations",
      "salesInquiryLineItems.rawMaterial"
    ]})
  }


  async update(id: number, updateSalesInquiryDto: UpdateSalesInquiryDto): Promise<SalesInquiry> {
    const salesInquiryToUpdate = await this.findOne(id);
    salesInquiryToUpdate.status = updateSalesInquiryDto.status;
    salesInquiryToUpdate.totalPrice = updateSalesInquiryDto.totalPrice;
    salesInquiryToUpdate.quotations = updateSalesInquiryDto.quotations;
    salesInquiryToUpdate.suppliers = updateSalesInquiryDto.suppliers;
    salesInquiryToUpdate.chosenQuotation = updateSalesInquiryDto.chosenQuotation;

    salesInquiryToUpdate.salesInquiryLineItems.forEach((lineItems) => {
      this.salesInquiryLineItemsRepository.delete(lineItems.id);
    });
    const salesInquiryLineItems = [];
    for (const dto of updateSalesInquiryDto.salesInquiryLineItemsDtos) {
      const salesInquiryLineItem = new SalesInquiryLineItem();
        salesInquiryLineItem.quantity = dto.quantity;
        salesInquiryLineItem.rawMaterial = await this.rawMaterialsRepository.findOne({
          where: {
            id: dto.rawMaterialId
          }
        });
        salesInquiryLineItem.indicativePrice = dto.indicativePrice;
        salesInquiryLineItems.push(salesInquiryLineItem);
    }
    salesInquiryToUpdate.salesInquiryLineItems = salesInquiryLineItems;
    
    return this.salesInquiriesRepository.save(salesInquiryToUpdate);
  }

  async remove(id: number): Promise<SalesInquiry> {
    const salesInquiryToRemove = await this.salesInquiriesRepository.findOneBy({id})
    return this.salesInquiriesRepository.remove(salesInquiryToRemove)
  }

  async addSupplier(addSupplierDto: AddSupplierDto): Promise<SalesInquiry>{
    const { salesInquiryId, shellOrganisationId } = addSupplierDto
    let shellOrganisation: ShellOrganisation
    
    shellOrganisation = await this.shellOrganisationsRepository.findOne({
      where: {
        id: shellOrganisationId
      }, relations: {
        parentOrganisation: true,
        contact: true
      }
    })
    
    let salesInquiry: SalesInquiry
    salesInquiry = await this.findOne(salesInquiryId)
    salesInquiry.suppliers.push(shellOrganisation)
    if (salesInquiry.status == SalesInquiryStatus.DRAFT) {
      salesInquiry.status = SalesInquiryStatus.SENT
    }
    this.mailerService.sendSalesInquiryEmail(shellOrganisation.contact.email, salesInquiry.currentOrganisation.name, shellOrganisation.name, salesInquiry.salesInquiryLineItems, salesInquiry)
    return this.salesInquiriesRepository.save(salesInquiry)
  }

  async removeSupplier(salesInquiryId: number, shellOrganisationId: number): Promise<SalesInquiry> {
    let shellOrganisation: ShellOrganisation
    shellOrganisation = await this.shellOrganisationsRepository.findOneByOrFail({id: shellOrganisationId})
    let salesInquiry: SalesInquiry
    salesInquiry = await this.salesInquiriesRepository.findOneByOrFail({id: salesInquiryId})
    let index = salesInquiry.suppliers.indexOf(shellOrganisation)
    salesInquiry.suppliers.splice(index, 1)
    return this.salesInquiriesRepository.save(salesInquiry)
  }
}
