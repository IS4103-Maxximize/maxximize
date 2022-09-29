/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryLineItem } from '../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { SendEmailDto } from './dto/send-email.dto';
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

  async create(
    createSalesInquiryDto: CreateSalesInquiryDto
  ): Promise<SalesInquiry> {
    try {
      const { currentOrganisationId, totalPrice, salesInquiryLineItemsDtos } = createSalesInquiryDto;
      let organisationToBeAdded: Organisation;
      organisationToBeAdded =
        await this.organisationsRepository.findOneByOrFail({
          id: currentOrganisationId,
        });
      const salesInquiryLineItems = [];

      for (const dto of createSalesInquiryDto.salesInquiryLineItemsDtos) {
        const salesInquiryLineItem = new SalesInquiryLineItem();
        salesInquiryLineItem.quantity = dto.quantity;
        salesInquiryLineItem.rawMaterial =
          await this.rawMaterialsRepository.findOne({
            where: {
              id: dto.rawMaterialId,
            },
          });
        salesInquiryLineItem.indicativePrice = dto.indicativePrice;
        salesInquiryLineItems.push(salesInquiryLineItem);
      }

      const newSalesInquiry = this.salesInquiriesRepository.create({
        status: SalesInquiryStatus.DRAFT,
        totalPrice: totalPrice,
        created: new Date(),
        currentOrganisation: organisationToBeAdded,
        salesInquiryLineItems: salesInquiryLineItems,
      });
      return this.salesInquiriesRepository.save(newSalesInquiry);
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        'either product code or Shell org id cannot be found'
      );
    }
  }

  findAll(): Promise<SalesInquiry[]> {
    return this.salesInquiriesRepository.find({
      relations: {
        currentOrganisation: true,
        suppliers: true,
        quotations: {
          shellOrganisation: true
        },
        salesInquiryLineItems: {
          rawMaterial: true,
        },
      },
    });
  }

  async findAllByOrg(organisationId: number): Promise<SalesInquiry[]> {
    return this.salesInquiriesRepository.find({
      where: {
        currentOrganisationId: organisationId
      },
      relations: {
        currentOrganisation: true,
        suppliers: true,
        quotations: {
          shellOrganisation: true
        },
        salesInquiryLineItems: {
          rawMaterial: true,
        },
      },
    });
  }

  findOne(id: number): Promise<SalesInquiry> {
    return this.salesInquiriesRepository.findOne({
      where: {
        id,
      },
      relations: [
        'currentOrganisation',
        'suppliers',
        'quotations',
        'salesInquiryLineItems.rawMaterial',
      ],
    });
  }

  async update(
    id: number,
    updateSalesInquiryDto: UpdateSalesInquiryDto
  ): Promise<SalesInquiry> {
    console.log(updateSalesInquiryDto);
    const salesInquiryToUpdate = await this.findOne(id);
    updateSalesInquiryDto.status ? salesInquiryToUpdate.status = updateSalesInquiryDto.status : //;
    updateSalesInquiryDto.totalPrice ? salesInquiryToUpdate.totalPrice = updateSalesInquiryDto.totalPrice : //;
    updateSalesInquiryDto.quotations ? salesInquiryToUpdate.quotations = updateSalesInquiryDto.quotations : //;
    updateSalesInquiryDto.suppliers ? salesInquiryToUpdate.suppliers = updateSalesInquiryDto.suppliers : //;
    updateSalesInquiryDto.chosenQuotation ? salesInquiryToUpdate.chosenQuotation = updateSalesInquiryDto.chosenQuotation : //;

    salesInquiryToUpdate.salesInquiryLineItems.forEach((lineItems) => {
      this.salesInquiryLineItemsRepository.delete(lineItems.id);
    });
    const salesInquiryLineItems = [];
    if (updateSalesInquiryDto.salesInquiryLineItemsDtos) {
        for (const dto of updateSalesInquiryDto.salesInquiryLineItemsDtos) {
        const salesInquiryLineItem = new SalesInquiryLineItem();
        salesInquiryLineItem.quantity = dto.quantity;
        salesInquiryLineItem.rawMaterial =
          await this.rawMaterialsRepository.findOne({
            where: {
              id: dto.rawMaterialId,
            },
          });
        salesInquiryLineItem.indicativePrice = dto.indicativePrice;
        salesInquiryLineItems.push(salesInquiryLineItem);
      }
    }
    salesInquiryToUpdate.salesInquiryLineItems = salesInquiryLineItems;

    return this.salesInquiriesRepository.save(salesInquiryToUpdate);
  }

  async remove(id: number): Promise<SalesInquiry> {
    const salesInquiryToRemove = await this.salesInquiriesRepository.findOneBy({
      id,
    });
    return this.salesInquiriesRepository.remove(salesInquiryToRemove);
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<SalesInquiry> {
    const { salesInquiryId, shellOrganisationIds } = sendEmailDto;
    let shellOrganisations: ShellOrganisation[] = [];
    let salesInquiry: SalesInquiry;
    salesInquiry = await this.findOne(salesInquiryId);
    for(let i=0;i<shellOrganisationIds.length;i++){
      let supplier: ShellOrganisation = await this.shellOrganisationsRepository.findOne({
        where: {
          id: shellOrganisationIds[i],
        },
        relations: {
          parentOrganisation: true,
          contact: true,
          salesInquiries: true
        },
      })
      shellOrganisations.push(supplier);
      salesInquiry.suppliers.push(supplier);
      // supplier.salesInquiries.push(salesInquiry);
      // this.shellOrganisationsRepository.save(supplier)
      // console.log(salesInquiry)
    }
    
    if (salesInquiry.status == SalesInquiryStatus.DRAFT) {
      salesInquiry.status = SalesInquiryStatus.SENT;
    }
    for (let i=0;i<shellOrganisations.length;i++){
      this.mailerService.sendSalesInquiryEmail(
        shellOrganisations[i].contact.email,
        salesInquiry.currentOrganisation.name,
        shellOrganisations[i].name,
        salesInquiry.salesInquiryLineItems,
        salesInquiry
      )
    }
    return this.salesInquiriesRepository.save(salesInquiry);
  }

  // async sendEmail(sendEmailDto: SendEmailDto): Promise<SalesInquiry> {
  //   const { salesInquiryId, shellOrganisationIds } = sendEmailDto;
  //   let shellOrganisations: ShellOrganisation[] = []

  //   for(let i=0;i<shellOrganisationIds.length;i++){
  //     shellOrganisations.push(await this.shellOrganisationsRepository.findOne({
  //       where: {
  //         id: shellOrganisationIds[i],
  //       },
  //       relations: {
  //         parentOrganisation: true,
  //         contact: true,
  //       },
  //     }));
  //   }
  //   let salesInquiry: SalesInquiry;
  //   salesInquiry = await this.findOne(salesInquiryId);
  //   if (salesInquiry.status == SalesInquiryStatus.DRAFT) {
  //     salesInquiry.status = SalesInquiryStatus.SENT;
  //   }
  //   for (let i=0;i<shellOrganisations.length;i++){
  //     this.mailerService.sendSalesInquiryEmail(
  //       shellOrganisations[i].contact.email,
  //       salesInquiry.currentOrganisation.name,
  //       shellOrganisations[i].name,
  //       salesInquiry.salesInquiryLineItems,
  //       salesInquiry
  //     )
  //   }
  //   console.log(salesInquiry)
  //   return this.salesInquiriesRepository.save(salesInquiry);
  // }

  /*async removeSupplier(
    salesInquiryId: number,
    shellOrganisationId: number
  ): Promise<SalesInquiry> {
    let shellOrganisation: ShellOrganisation;
    shellOrganisation = await this.shellOrganisationsRepository.findOneByOrFail(
      { id: shellOrganisationId }
    );
    let salesInquiry: SalesInquiry;
    salesInquiry = await this.salesInquiriesRepository.findOneByOrFail({
      id: salesInquiryId,
    });
    let index = salesInquiry.suppliers.indexOf(shellOrganisation);
    salesInquiry.suppliers.splice(index, 1);
    return this.salesInquiriesRepository.save(salesInquiry);
  }*/
}
