import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';

describe('BillOfMaterialsService', () => {
  let service: BillOfMaterialsService;

  const finalGood = {
    id: 1,
    name: 'test name',
    description: 'test description',
    unit: MeasurementUnit.LITRE,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10,
  }

  const rawMaterial = {
    id: 2,
    name: 'tomato',
    description: 'test description',
    unit: MeasurementUnit.KILOGRAM,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10
  }

  const bomLineItem = {
    id: 1,
    quantity: 5,
    rawMaterial: rawMaterial
  }

  const billOfMaterial = {
    id: 1,
    finalGood: finalGood,
    bomLineItems: [bomLineItem]
  }

  const mockBillOfMaterialRepository = {
    save: jest.fn().mockImplementation(finalGood => {
      return {
        ...billOfMaterial,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([billOfMaterial]),
    findOne: jest.fn().mockResolvedValue(billOfMaterial),
    findOneBy: jest.fn().mockResolvedValue(billOfMaterial),
    remove: jest.fn().mockImplementation(bomToRemove => {
      return bomToRemove
    })
  }

  const mockBomLineItemRepository = {}

  const mockProductsRepo = {}

  const mockDataSource = () => ({
    manager: {
      transaction: jest.fn()
    }
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillOfMaterialsService, {
        provide: getRepositoryToken(BillOfMaterial),
        useValue: mockBillOfMaterialRepository
      }, {
        provide: getRepositoryToken(BomLineItem),
        useValue: mockBomLineItemRepository
      }, {
        provide: DataSource,
        useFactory: mockDataSource
      }, {
        provide: getRepositoryToken(Product),
        useValue: mockProductsRepo
      }
    ],
    }).compile();

    service = module.get<BillOfMaterialsService>(BillOfMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
