import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { LineItem } from '../line-Items/LineItem';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { SalesInquiryLineItem } from './entities/sales-inquiry-line-item.entity';
import { SalesInquiryLineItemsService } from './sales-inquiry-line-items.service';

describe('SalesInquiryLineItemsService', () => {
  const rawMaterial = {
    id: 1,
    name: 'tomato'
  }

  const finalGood = {
    id: 2,
    name: 'tomato paste'
  }

  const parentSI = {
    id: 2,
    totalPrice: 150,
  }

  const salesInquiryLineItem = {
    id: 1,
    rawMaterial: rawMaterial,
    finalGood: finalGood,
    quantity: 30,
    indicativePrice: 5,
    salesInquiry: parentSI
  }

  const salesInquiry = {
    id: 2,
    totalPrice: 150,
    salesInquiryLineItems: [salesInquiryLineItem]
  }

  

  
  let service: SalesInquiryLineItemsService;
  let rawMaterialRepo
  let salesInquiryLineItemRepo
  let salesInquiryRepo
  const mockSalesInquiryLineItemRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(lineItem => {
      return {
        ...lineItem,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([salesInquiryLineItem]),
    findOne: jest.fn().mockResolvedValue(salesInquiryLineItem),
    findOneBy: jest.fn().mockResolvedValue(salesInquiryLineItem),
    findOneByOrFail: jest.fn().mockResolvedValue(salesInquiryLineItem),
    remove: jest.fn().mockImplementation(siToRemove => {
      return siToRemove
    })
  }
  const mockSalesInquiryRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(salesInquiry),
    save: jest.fn().mockImplementation(si => {
      return {
        ...si,
        id: si.id ?? salesInquiry.id
      }
    })
  }
  const mockRawMaterialRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(rawMaterial)
  }
  const mockFinalGoodsService = {
    findOne: jest.fn().mockResolvedValue(finalGood)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesInquiryLineItemsService, {
        provide: getRepositoryToken(SalesInquiry),
        useValue: mockSalesInquiryRepo
      }, {
        provide: getRepositoryToken(RawMaterial),
        useValue: mockRawMaterialRepo
      }, {
        provide: FinalGoodsService,
        useValue: mockFinalGoodsService
      }, {
        provide: getRepositoryToken(SalesInquiryLineItem),
        useValue: mockSalesInquiryLineItemRepo
      }],
    }).compile();

    salesInquiryRepo = module.get<Repository<SalesInquiry>>(getRepositoryToken(SalesInquiry))
    salesInquiryLineItemRepo = module.get<Repository<SalesInquiryLineItem>>(getRepositoryToken(SalesInquiryLineItem))
    rawMaterialRepo = module.get<Repository<RawMaterial>>(getRepositoryToken(RawMaterial))
    service = module.get<SalesInquiryLineItemsService>(
      SalesInquiryLineItemsService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      quantity: 30,
      indicativePrice: 5,
      rawMaterialId: rawMaterial.id,
      finalGoodId: finalGood.id
    }
    it('should return a sales inquiry line item if successful', async() => {
      
      const expected = {
        quantity: dto.quantity,
        indicativePrice: dto.indicativePrice,
        rawMaterial: rawMaterial,
        finalGood: finalGood,
        id: 1
      }
      expect(await service.create(dto)).toStrictEqual(expected)
    })

    it('should throw an exception if raw material cannot be found', () => {
      jest.spyOn(rawMaterialRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.create(dto)).rejects.toEqual(new NotFoundException('The Entity cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all sales Inquiry Line Items', async() => {
      const expected = [salesInquiryLineItem]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a sales inquiry line item', async() => {
      const expected = salesInquiryLineItem
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      quantity: 40
    }
    it('should update sales inquiry line item and return updated version', async() => {
      const expected = {
        ...salesInquiryLineItem,
        quantity: updateDto.quantity
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset back
      await service.update(1, {...updateDto, quantity: 30})
    })
    it('should throw an exception if sales inquiry line item cannot be found', () => {
      jest.spyOn(salesInquiryLineItemRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(3, updateDto)).rejects.toEqual(new NotFoundException('sales Inquiry Line item with id:3 cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed sales inquriry line item', async() => {
      const expected = salesInquiryLineItem
      const savedSI = {
        ...salesInquiry,
        totalPrice: 0
      }
      expect(await service.remove(1)).toStrictEqual(expected)
      expect(salesInquiryRepo.save).toBeCalledWith(savedSI)
    })
  })
});
