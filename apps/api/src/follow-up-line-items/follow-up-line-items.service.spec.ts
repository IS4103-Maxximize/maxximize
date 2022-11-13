import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { PurchaseOrderStatus } from '../purchase-orders/enums/purchaseOrderStatus.enum';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { FollowUpLineItem } from './entities/follow-up-line-item.entity';
import { FollowUpLineItemsService } from './follow-up-line-items.service';

describe('FollowUpLineItemsService', () => {
  let service: FollowUpLineItemsService;
  let dataSource: DataSource;

  const purchaseOrder = {
    id: 1,
    status: PurchaseOrderStatus.CREATEDVIACSV,
    deliveryAddress: 'testAddress',
    totalPrice: 100,
    created: new Date(),
  };

  const rawMaterial = {
    id: 1,
    name: 'tomato',
    description: 'test desc',
    skuCode: 'testSku',
    unit: MeasurementUnit.KILOGRAM,
    unitPrice: 10,
    lotQuantity: 50,
    type: 'RawMaterial',
    expiry: 10,
    organisationId: 2,
  };

  const testFollowUp = {
    quantity: 10,
    rawMaterial: rawMaterial,
    purchaseOrder: purchaseOrder,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowUpLineItemsService,
        {
          provide: getRepositoryToken(FollowUpLineItem),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((followUpLineItem) =>
                Promise.resolve({ id: 1, ...followUpLineItem })
              ),
            find: jest.fn().mockImplementation(() => {
              return [testFollowUp];
            }),
            findOneBy: jest.fn().mockImplementation(() => {
              return testFollowUp;
            }),
            findOneOrFail: jest.fn().mockImplementation(() => {
              return testFollowUp;
            }),
            delete: jest.fn().mockResolvedValue(testFollowUp),
          },
        },
        {
          provide: RawMaterialsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(rawMaterial),
          },
        },
        {
          provide: PurchaseOrdersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(purchaseOrder),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockImplementation(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              release: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              manager: {
                save: jest.fn().mockImplementation((dto) => {
                  return {
                    id: 1,
                    ...dto,
                  };
                }),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<FollowUpLineItemsService>(FollowUpLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
