import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ProductionRequest } from './entities/production-request.entity';
import { ProductionRequestsService } from './production-requests.service';

describe('ProductionRequestsService', () => {
  let service: ProductionRequestsService;

  const mockProdReqRepo = {}
  const mockPurchaseOrdersService = {}
  const mockDataSource = () => {}
  const mockFinalGoodsService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionRequestsService, {
        provide: getRepositoryToken(ProductionRequest),
        useValue: mockProdReqRepo
      }, {
        provide: PurchaseOrdersService,
        useValue: mockPurchaseOrdersService
      }, {
        provide: DataSource,
        useFactory: mockDataSource
      }, {
        provide: FinalGoodsService,
        useValue: mockFinalGoodsService
      }
    ],
    }).compile();

    service = module.get<ProductionRequestsService>(ProductionRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
