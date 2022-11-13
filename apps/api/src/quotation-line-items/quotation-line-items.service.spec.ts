/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { QuotationLineItem } from './entities/quotation-line-item.entity';
import { QuotationLineItemsService } from './quotation-line-items.service';

describe('QuotationLineItemsService', () => {
  let service: QuotationLineItemsService;
  let quotationsRepo
  let quotationLineItemsRepo

  const rawMaterial = {
    id: 1,
    name: 'test name',
    description: 'test description',
    unit: MeasurementUnit.LITRE,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10
  }

  const finalGood = {
    id: 2,
    name: 'test name',
    description: 'test description',
    unit: MeasurementUnit.LITRE,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10
  }

  const quotation = {
    id: 1,
    created: new Date('2022-11-11'),
    totalPrice: 50,
    leadTime: 3
  }

  const quotationLineItem = {
    id: 1,
    quantity: 30,
    price: 5,
    rawMaterial: rawMaterial,
    finalGood: null,
    quotation: quotation
  }

  const mockQuotationLineItemsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(quotationLineItem => {
      return {
        ...quotationLineItem,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([quotationLineItem]),
    findOne: jest.fn().mockResolvedValue(quotationLineItem),
    findOneBy: jest.fn().mockResolvedValue(quotationLineItem),
    remove: jest.fn().mockImplementation(quotationLineItemToRemove => {
      return quotationLineItemToRemove
    })
  }

  const mockQuotationsRepo = {
    save: jest.fn().mockImplementation(quotation => {
      return {
        ...quotation,
        id: 1
      }
    }),
    findOneByOrFail: jest.fn().mockResolvedValue(quotation)
  }

  const mockRawMaterialRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(rawMaterial)
  }

  const mockFinalGoodsRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(finalGood)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationLineItemsService, {
        provide: getRepositoryToken(QuotationLineItem),
        useValue: mockQuotationLineItemsRepo
      }, {
        provide: getRepositoryToken(Quotation),
        useValue: mockQuotationsRepo
      }, {
        provide: getRepositoryToken(RawMaterial),
        useValue: mockRawMaterialRepo
      }, {
        provide: getRepositoryToken(FinalGood),
        useValue: mockFinalGoodsRepo
      }
    ],
    }).compile();

    quotationsRepo = module.get<Repository<Quotation>>(getRepositoryToken(Quotation))
    quotationLineItemsRepo = module.get<Repository<QuotationLineItem>>(getRepositoryToken(QuotationLineItem))
    service = module.get<QuotationLineItemsService>(QuotationLineItemsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      quantity: 30, price: 5, rawMaterialId: 1, quotationId: 1
    }

    const dto2 = {
      quantity: 30, price: 5, rawMaterialId: 1, quotationId: 2
    }

    const expected = quotationLineItem
    it('should return a quotation line item if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if sales inquiry or organisation cannot be found', () => {
      jest.spyOn(quotationsRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('The quotation cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all quotation line items', async() => {
      const expected = [quotationLineItem]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a quotation line item', async() => {
      const expected = quotationLineItem
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if quotation line item with id cannot be found', () => {
      jest.spyOn(quotationLineItemsRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException('The quotation line item cannot be found'))
    })
  })

  describe('update', () => {
    const updateDto = {
      quantity: 40
    }
    it('should return the updated quotation line item', async() => {
      const expected = {
        ...quotationLineItem,
        quantity: updateDto.quantity
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, quantity: 30})
    })
    it('should throw an exception if quotation line item cannot be found', () => {
      jest.spyOn(quotationLineItemsRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('The quotation line item cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed quotation line item if successful', async() => {
      await service.remove(1)
      const expected = quotationLineItem
      expect(quotationLineItemsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if quotation line item cannot be found', () => {
      jest.spyOn(quotationLineItemsRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('The quotation line item cannot be found'))
    })
  })

});
