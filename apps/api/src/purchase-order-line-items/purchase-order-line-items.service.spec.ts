/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';

describe('PurchaseOrderLineItemsService', () => {
  let service: PurchaseOrderLineItemsService;
  let poLineItemsRepo
  let dataSource

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

  const poLineItem = {
    id: 1,
    quantity: 30,
    price: 5,
    rawMaterial: rawMaterial,
    finalGood: finalGood,
    fulfilledQuantity: 0
  }

  const mockPurchaseOrderLineItemsRepo = {
    save: jest.fn().mockImplementation(poLineItem => {
      return {
        ...poLineItem,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([poLineItem]),
    findOne: jest.fn().mockResolvedValue(poLineItem),
    findOneBy: jest.fn().mockResolvedValue(poLineItem),
    remove: jest.fn().mockImplementation(poLineItemToRemove => {
      return poLineItemToRemove
    })
  }
  const mockDataSource = () => ({
    manager: {
      transaction: jest.fn()
    }
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseOrderLineItemsService, {
        provide: getRepositoryToken(PurchaseOrderLineItem),
        useValue: mockPurchaseOrderLineItemsRepo
      }, {
        provide: DataSource,
        useFactory: mockDataSource
      }
    ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource)
    poLineItemsRepo = module.get<Repository<PurchaseOrderLineItem>>(getRepositoryToken(PurchaseOrderLineItem))
    service = module.get<PurchaseOrderLineItemsService>(
      PurchaseOrderLineItemsService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      quantity: 30, price: 5, rawMaterialId: 1, finalGoodId: 2
    }

    const dto2 = {
      quantity: 30, price: 5, rawMaterialId: 3, finalGpodId: 2
    }

    const expected = poLineItem
    it('should return a purchase order line item if successful', async() => {
      const mockedTransactionalEntityManager = {
        create: jest.fn().mockImplementation(() => {
          return poLineItem
        }),
        save: jest.fn(),
        findOneBy: jest.fn()
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if raw material or final good cannot be found', () => {
      const mockedTransactionalEntityManager = {
        create: jest.fn().mockImplementation(() => {
          return poLineItem
        }),
        save: jest.fn(),
        findOneBy: jest.fn()
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      jest.spyOn(mockedTransactionalEntityManager, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('The raw material or final good cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all purchase order line items', async() => {
      const expected = [poLineItem]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a purchase order line item', async() => {
      const expected = poLineItem
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if purchase order line item with id cannot be found', () => {
      jest.spyOn(poLineItemsRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException('The purchase order line item cannot be found'))
    })
  })

  describe('update', () => {
    const updateDto = {
      quantity: 40
    }
    it('should return the updated purchase order line item', async() => {
      const expected = {
        ...poLineItem,
        quantity: updateDto.quantity
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, quantity: 30})
    })
    it('should throw an exception if purchase order line item cannot be found', () => {
      jest.spyOn(poLineItemsRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('The purchase order line item cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed purchase order line item if successful', async() => {
      await service.remove(1)
      const expected = poLineItem
      expect(poLineItemsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if purchase order line item cannot be found', () => {
      jest.spyOn(poLineItemsRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('The purchase order line item cannot be found'))
    })
  })

});
