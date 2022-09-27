import { Test, TestingModule } from '@nestjs/testing';
import { ProductionOrdersService } from './production-orders.service';

describe('ProductionOrdersService', () => {
  let service: ProductionOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionOrdersService],
    }).compile();

    service = module.get<ProductionOrdersService>(ProductionOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
