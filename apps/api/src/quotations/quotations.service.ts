/* eslint-disable prefer-const */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { QuotationLineItem } from '../quotation-line-items/entities/quotation-line-item.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { SalesInquiryStatus } from '../sales-inquiry/enums/salesInquiryStatus.enum';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { Quotation } from './entities/quotation.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(SalesInquiry)
    private readonly salesInquiriesRepository: Repository<SalesInquiry>,
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationsRepository: Repository<ShellOrganisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @Inject(forwardRef(() => SalesInquiryService))
    private salesInquiryService: SalesInquiryService,
    private organisationService: OrganisationsService
  ) {}

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    try {
      const { salesInquiryId, shellOrganisationId, leadTime, currentOrganisationId, receivingOrganisationId } = createQuotationDto;
      let shellOrganisationToBeAdded: ShellOrganisation;
      let receivingOrganisationToBeAdded: Organisation
      let salesInquiryToBeAdded: SalesInquiry;
      const currentOrganisation = await this.organisationService.findOne(currentOrganisationId)
      shellOrganisationToBeAdded = shellOrganisationId ?
        await this.shellOrganisationsRepository.findOneByOrFail({
          id: shellOrganisationId,
        }) : null
      receivingOrganisationToBeAdded = receivingOrganisationId ? 
      await this.organisationService.findOne(receivingOrganisationId) : null
      salesInquiryToBeAdded =
        await this.salesInquiriesRepository.findOneByOrFail({
          id: salesInquiryId,
        });
      
      const newQuotation = this.quotationsRepository.create({
        created: new Date(),
        totalPrice: 0,
        salesInquiry: salesInquiryToBeAdded,
        shellOrganisation: shellOrganisationToBeAdded,
        receivingOrganisation: receivingOrganisationToBeAdded,
        currentOrganisation: currentOrganisation,
        leadTime,
        quotationLineItems: [],
      });
      
      const quotation = await this.quotationsRepository.save(newQuotation);
      if (receivingOrganisationToBeAdded) await this.salesInquiryService.update(salesInquiryId, {status: SalesInquiryStatus.REPLIED})
      return quotation
    } catch (error) {
      throw new NotFoundException('The sales inquiry or organisation cannot be found');
    }
  }

  findAll(): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      relations: {
        currentOrganisation: true,
        receivingOrganisation: true,
        shellOrganisation: {
          contact: true
        },
        quotationLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        salesInquiry: {
          currentOrganisation: true
        },
        purchaseOrder: true
      }
    })
  }

  async findSentQuotationsByOrg(organisationId: number): Promise<Quotation[]> {
    const quotations = await this.quotationsRepository.find({
      where: {
        currentOrganisationId: organisationId,
        shellOrganisation: IsNull()
      }, relations: {
        salesInquiry: true,
        receivingOrganisation: true,
        quotationLineItems: {
          rawMaterial: true,
          finalGood: true
        },
      }
    })
    return quotations
  }

  async findReceivedQuotationsByOrg(organisationId: number): Promise<Quotation[]> {
    const shellOrgQuotations = await this.quotationsRepository.find({
      where: {
        currentOrganisationId: organisationId,
        receivingOrganisationId: IsNull()
      }, relations: {
        shellOrganisation: true,
        salesInquiry: true,
        quotationLineItems: {
          rawMaterial: true,
          finalGood: true
        },
      }
    })

    const receivedQuotations = await this.quotationsRepository.find({
      where: {
        receivingOrganisationId: organisationId
      }, relations: {
        currentOrganisation: true,
        salesInquiry: true,
        quotationLineItems: {
          rawMaterial: true,
          finalGood: true
        },
      }
    })

    console.log(receivedQuotations)

  
    return [...shellOrgQuotations, ...receivedQuotations]
  }

  async findOne(id: number): Promise<Quotation> {
    try {
      return await this.quotationsRepository.findOne({
        where: {
          id,
        },
        relations: {
          shellOrganisation: {
            contact: true,
          },
          currentOrganisation: true,
          receivingOrganisation: true,
          salesInquiry: true,
          quotationLineItems: {
            rawMaterial: true,
            finalGood: true
          },
        },
      });
    } catch(err) {
      throw new NotFoundException('The quotation cannot be found')
    }
    
  }

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto
  ): Promise<Quotation> {
    try{
      //update lot quantity, lot price, unit
      //shell org and product should remain the same!

      const quotationToUpdate = await this.quotationsRepository.findOne({ 
        where: {
          id,
        },
        relations: {
          shellOrganisation: {
            contact: true
          },
        }
      });
      const arrayOfKeyValues = Object.entries(updateQuotationDto);
      arrayOfKeyValues.forEach(([key, value]) => {
        quotationToUpdate[key] = value;
      });
      return this.quotationsRepository.save(quotationToUpdate);
    } catch (err) {
      throw new NotFoundException('The quotation cannot be found')
    }
    
  }

  async remove(id: number): Promise<Quotation> {
    try {
      const quotationToRemove = await this.quotationsRepository.findOneBy({ id });
      return this.quotationsRepository.remove(quotationToRemove);
    } catch (err) {
      throw new NotFoundException('The quotation cannot be found')
    }
    
  }
}
