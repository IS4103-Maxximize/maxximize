import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { SalesInquiryStatus } from '../sales-inquiry/enums/salesInquiryStatus.enum';
import { SalesInquiryService } from '../sales-inquiry/sales-inquiry.service';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { Quotation } from './entities/quotation.entity';
import { QuotationsService } from './quotations.service';

describe('QuotationsService', () => {
  let service: QuotationsService;
  let salesInquiriesRepo
  let quotationsRepo

  const salesInquiry = {
    id: 1,
    status: SalesInquiryStatus.DRAFT,
    totalPrice: 50,
    created: new Date('2022-11-11')
  }

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}

  const shellOrganisation = {id: 1, name: 'shell organisation', uen: '123445123'}

  const quotation = {
    id: 1,
    created: new Date('2022-11-11'),
    totalPrice: 50,
    leadTime: 3,
    currentOrganisation: organisation,
    salesInquiry: salesInquiry,
    shellOrganisation: shellOrganisation
  }

  const mockPurchaseOrdersRepo = {}

  const mockSalesInquiriesRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(salesInquiry)
  }

  const mockShellOrganisationsRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(shellOrganisation)
  }

  const mockQuotationsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(quotation => {
      return {
        ...quotation,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([quotation]),
    findOne: jest.fn().mockResolvedValue(quotation),
    findOneBy: jest.fn().mockResolvedValue(quotation),
    remove: jest.fn().mockImplementation(quotationToRemove => {
      return quotationToRemove
    })
  }

  const mockSalesInquiryService = {
    update: jest.fn().mockResolvedValue({...salesInquiry, status: SalesInquiryStatus.REPLIED})
  }

  const mockOrganisationsService = {
    findOne: jest.fn().mockResolvedValue(organisation)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationsService, {
        provide: getRepositoryToken(PurchaseOrder),
        useValue: mockPurchaseOrdersRepo
      }, {
        provide: getRepositoryToken(SalesInquiry),
        useValue: mockSalesInquiriesRepo
      }, {
        provide: getRepositoryToken(ShellOrganisation),
        useValue: mockShellOrganisationsRepo
      }, {
        provide: getRepositoryToken(Quotation),
        useValue: mockQuotationsRepo
      }, {
        provide: SalesInquiryService,
        useValue: mockSalesInquiryService
      }, {
        provide: OrganisationsService,
        useValue: mockOrganisationsService
      }],
    }).compile();

    quotationsRepo =module.get<Repository<Quotation>>(getRepositoryToken(Quotation))
    salesInquiriesRepo = module.get<Repository<SalesInquiry>>(getRepositoryToken(SalesInquiry))
    service = module.get<QuotationsService>(QuotationsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      salesInquiryId: 1, shellOrganisationId: 1, leadTime: 3, currentOrganisationId: 1
    }

    const dto2 = {
      salesInquiryId: 2, shellOrganisationId: 1, leadTime: 3, currentOrganisationId: 1
    }

    const expected = quotation
    it('should return a quotation if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if sales inquiry or organisation cannot be found', () => {
      jest.spyOn(salesInquiriesRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('The sales inquiry or organisation cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all quotations', async() => {
      const expected = [quotation]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a quotation', async() => {
      const expected = quotation
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if quotation with id cannot be found', () => {
      jest.spyOn(quotationsRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException('The quotation cannot be found'))
    })
  })
  
  describe('findSentQuotationsByOrg', () => {
    it('should return all sent quotations in an organisation', async() => {
      const expected = [quotation]
      expect(await service.findSentQuotationsByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('findReceivedQuotationsByOrg', () => {
    it('should return all received quotations in an organisation', async() => {
      const expected = [quotation, quotation]
      expect(await service.findReceivedQuotationsByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      leadTime: 5
    }
    it('should return the updated quotation', async() => {
      const expected = {
        ...quotation,
        leadTime: updateDto.leadTime
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, leadTime: 3})
    })
    it('should throw an exception if quotation cannot be found', () => {
      jest.spyOn(quotationsRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('The quotation cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed quotation if successful', async() => {
      await service.remove(1)
      const expected = quotation
      expect(quotationsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if quotation cannot be found', () => {
      jest.spyOn(quotationsRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('The quotation cannot be found'))
    })
  })

});
