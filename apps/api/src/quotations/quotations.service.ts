/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { QuotationLineItem } from '../quotation-line-items/entities/quotation-line-item.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
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
    @InjectRepository(QuotationLineItem)
    private readonly quotationLineItemsRepository: Repository<QuotationLineItem>,
    private salesInquiryService: SalesInquiryService
  ) {}

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    try {
      const { salesInquiryId, shellOrganisationId, leadTime } = createQuotationDto;
      let shellOrganisationToBeAdded: ShellOrganisation;
      let salesInquiryToBeAdded: SalesInquiry;
      shellOrganisationToBeAdded =
        await this.shellOrganisationsRepository.findOneByOrFail({
          id: shellOrganisationId,
        });
      salesInquiryToBeAdded =
        await this.salesInquiriesRepository.findOneByOrFail({
          id: salesInquiryId,
        });
      const newQuotation = this.quotationsRepository.create({
        created: new Date(),
        totalPrice: 0,
        salesInquiry: salesInquiryToBeAdded,
        shellOrganisation: shellOrganisationToBeAdded,
        leadTime,
        quotationLineItems: [],
      });
      return this.quotationsRepository.save(newQuotation);
    } catch (error) {
      throw new NotFoundException(
        'either product code or Shell org id cannot be found'
      );
    }
  }

  findAll(): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      relations: {
        shellOrganisation: true,
        quotationLineItems: {
          rawMaterial: true
        },
        salesInquiry: {
          currentOrganisation: true
        },
        purchaseOrder: true
      }
    })
  }

  async findAllBySalesInquiry(salesInquiryId: number): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      where: {
        salesInquiryId: salesInquiryId
      },
      relations: {
        shellOrganisation: true,
        quotationLineItems: {
          rawMaterial: true
        },
        salesInquiry: {
          currentOrganisation: true
        }
      }
    })
  }

  async findAllByOrg(organisationId: number): Promise<Quotation[]> {
    let salesInquiries: SalesInquiry[] = await this.salesInquiryService.findAllByOrg(organisationId)
    let salesInquiryIds: number[] = salesInquiries.map(salesInquiry => salesInquiry.id)
    let quotations: Quotation[] = []
    for (let i=0;i<salesInquiryIds.length;i++){
      let qts: Quotation[] = await this.findAllBySalesInquiry(salesInquiryIds[i])
      quotations = quotations.concat(qts)
    }
    return quotations
  }

  findOne(id: number): Promise<Quotation> {
    return this.quotationsRepository.findOne({
      where: {
        id,
      },
      relations: [
        "shellOrganisation.contact"
      ]
    });
  }

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto
  ): Promise<Quotation> {
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
  }

  async remove(id: number): Promise<Quotation> {
    const quotationToRemove = await this.quotationsRepository.findOneBy({ id });
    return this.quotationsRepository.remove(quotationToRemove);
  }
}
