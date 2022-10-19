/* eslint-disable prefer-const */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { MailService } from '../mail/mail.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsService } from '../organisations/organisations.service';
import { PurchaseRequisition } from '../purchase-requisitions/entities/purchase-requisition.entity';
import { PurchaseRequisitionsService } from '../purchase-requisitions/purchase-requisitions.service';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryLineItem } from '../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { CreateSalesInquiryDto } from './dto/create-sales-inquiry.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { UpdateSalesInquiryDto } from './dto/update-sales-inquiry.dto';
import { SalesInquiry } from './entities/sales-inquiry.entity';
import { SalesInquiryStatus } from './enums/salesInquiryStatus.enum';
import { Cron } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChronJobsService } from '../chron-jobs/chron-jobs.service';
import { ChronType } from '../chron-jobs/enums/chronType.enum';

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
    @InjectRepository(PurchaseRequisition)
    private readonly purchaseRequisitionRepository: Repository<PurchaseRequisition>,
    private mailerService: MailService,
    @Inject(forwardRef(() => PurchaseRequisitionsService))
    private purchaseRequisitionSevice: PurchaseRequisitionsService,
    private organisationService: OrganisationsService,
    private finalGoodService: FinalGoodsService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ChronJobsService))
    private chronJobService: ChronJobsService
  ) {}

  async create(
    createSalesInquiryDto: CreateSalesInquiryDto
  ): Promise<SalesInquiry> {
    try {
      const { currentOrganisationId, totalPrice, salesInquiryLineItemsDtos, purchaseRequisitionIds, receivingOrganisationId, expiryDuration} = createSalesInquiryDto;
      let organisationToBeAdded: Organisation;
      organisationToBeAdded =
        await this.organisationsRepository.findOneByOrFail({
          id: currentOrganisationId,
        });
      const salesInquiryLineItems: SalesInquiryLineItem[] = [];

      for (const dto of salesInquiryLineItemsDtos) {
        const salesInquiryLineItem = new SalesInquiryLineItem();
        salesInquiryLineItem.quantity = dto.quantity;
        salesInquiryLineItem.rawMaterial =
          await this.rawMaterialsRepository.findOne({
            where: {
              id: dto.rawMaterialId,
            },
          });
        salesInquiryLineItem.indicativePrice = dto.indicativePrice;
        //check if finalGood is a valid FinalGood
        if (dto.finalGoodId) {
          const finalGood = await this.finalGoodService.findOne(dto.finalGoodId)
          if (finalGood) {
            salesInquiryLineItem.finalGood = finalGood
          } else {
            throw new NotFoundException(`final good with id: ${dto.finalGoodId} cannot be found!`)
          }
        }
        salesInquiryLineItems.push(salesInquiryLineItem);
      }

      const purchaseRequisitions = []
      if (purchaseRequisitionIds) {
        for (const id of purchaseRequisitionIds) {
          const purchaseRequisition = await this.purchaseRequisitionRepository.findOne({where: {id}});
          purchaseRequisitions.push(purchaseRequisition);
        }
      }
      let receivingOrganisation: Organisation
      if (receivingOrganisationId) {
        receivingOrganisation = await this.organisationService.findOne(receivingOrganisationId)
      }

      const newSalesInquiry = this.salesInquiriesRepository.create({
        status: receivingOrganisation ? SalesInquiryStatus.SENT : SalesInquiryStatus.DRAFT,
        totalPrice: totalPrice,
        created: new Date(),
        expiryDuration: expiryDuration,
        currentOrganisation: organisationToBeAdded,
        salesInquiryLineItems: salesInquiryLineItems,
        receivingOrganisation: receivingOrganisation
      });

      const newSI = await this.salesInquiriesRepository.save(newSalesInquiry);


     
      //add chrom Job for this new SI
      if (expiryDuration) {
       
        const dataToUpdate = new Date(new Date().getTime() + 1800000)

        const job = new CronJob(dataToUpdate, async() => {
          //update SI status to expired
          const si = await this.findOne(newSI.id)
          if (si.status === SalesInquiryStatus.SENT) {
            await this.update(newSI.id, {status: SalesInquiryStatus.EXPIRED})
          }
        });
      
        this.schedulerRegistry.addCronJob(`${newSI.id}-updateSiToExpired`, job);
        job.start();
        //add chron job to database
        await this.chronJobService.create({scheduledDate: dataToUpdate, type: ChronType.SALESINQUIRY, targetId: newSI.id})
      }
      

      // link PRs with sales inquiry
      if (purchaseRequisitionIds) {
        for (const id of purchaseRequisitionIds) {
          await this.purchaseRequisitionSevice.update(id, {
            salesInquiryId: newSI.id
          }).then((res) => console.log(res));
        }
      }

      return this.findOne(newSI.id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        error
      );
    }
  }

  // @Cron(new Date(new Date().setHours(18, 10, 0)))
  // handleCron() {
  //   console.log('TEST');
  // }

  findAll(): Promise<SalesInquiry[]> {
    return this.salesInquiriesRepository.find({
      relations: {
        currentOrganisation: true,
        receivingOrganisation: true,
        suppliers: true,
        quotations: {
          shellOrganisation: true
        },
        salesInquiryLineItems: {
          rawMaterial: true,
        },
        purchaseRequisitions: true
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
        receivingOrganisation: true,
        suppliers: true,
        quotations: {
          shellOrganisation: true
        },
        salesInquiryLineItems: {
          rawMaterial: true,
        },
        purchaseRequisitions: true
      },
    });
  }

  async findSentSalesInquiriesByOrg(organisationId: number): Promise<SalesInquiry[]> {
    const salesInquiries = await this.salesInquiriesRepository.find({
      where: {
        currentOrganisationId: organisationId,
      }, relations: {
        suppliers: true,
        receivingOrganisation: true,
        salesInquiryLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        quotations: true,
		purchaseRequisitions: true
      }
    })
    return salesInquiries
  }

  async findReceviedSalesInquiriesByOrg(organisationId: number): Promise<SalesInquiry[]> {
    const salesInquiries = await this.salesInquiriesRepository.find({
      where: {
        receivingOrganisationId: organisationId,
      }, relations: {
        currentOrganisation: true,
        salesInquiryLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        quotations: true,
		purchaseRequisitions: true
      }
    })
    return salesInquiries
  }

  findOne(id: number): Promise<SalesInquiry> {
    return this.salesInquiriesRepository.findOne({
      where: {
        id,
      },
      // relations: [
      //   'currentOrganisation',
      //   'suppliers',
      //   'quotations',
      //   'salesInquiryLineItems.rawMaterial',
      //   'purchaseRequisitions.productionLineItem.productionOrder.prodLineItems'
      // ],
      relations: {
        currentOrganisation: true,
        receivingOrganisation: true,
        suppliers: true,
        quotations: true,
        salesInquiryLineItems: {
          rawMaterial: true,
          finalGood: true
        },
        purchaseRequisitions:{
          productionLineItem: {
            productionOrder: {
              prodLineItems: true
            }
          },
          rawMaterial: true
        }
      }
    });
  }

  async update(
    id: number,
    updateSalesInquiryDto: UpdateSalesInquiryDto
  ): Promise<SalesInquiry> {
    const salesInquiryToUpdate = await this.findOne(id);
    salesInquiryToUpdate.status = updateSalesInquiryDto.status ?? salesInquiryToUpdate.status
    salesInquiryToUpdate.totalPrice = updateSalesInquiryDto.totalPrice ?? salesInquiryToUpdate.totalPrice
    salesInquiryToUpdate.quotations = updateSalesInquiryDto.quotations ?? salesInquiryToUpdate.quotations
    salesInquiryToUpdate.suppliers = updateSalesInquiryDto.suppliers ?? salesInquiryToUpdate.suppliers
    salesInquiryToUpdate.chosenQuotation = updateSalesInquiryDto.chosenQuotation ?? salesInquiryToUpdate.chosenQuotation

    // salesInquiryToUpdate.salesInquiryLineItems.forEach((lineItems) => {
    //   this.salesInquiryLineItemsRepository.delete(lineItems.id);
    // });
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
    salesInquiryToUpdate.salesInquiryLineItems = updateSalesInquiryDto.salesInquiryLineItemsDtos ? salesInquiryLineItems : salesInquiryToUpdate.salesInquiryLineItems;
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
