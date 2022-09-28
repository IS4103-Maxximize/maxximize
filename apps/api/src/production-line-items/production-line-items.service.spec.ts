import { Test, TestingModule } from '@nestjs/testing';
import { ProductionLineItemsService } from './production-line-items.service';

describe('ProductionLineItemsService', () => {
  let service: ProductionLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionLineItemsService],
    }).compile();

    service = module.get<ProductionLineItemsService>(
      ProductionLineItemsService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
