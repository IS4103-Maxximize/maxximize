import { Test, TestingModule } from '@nestjs/testing';
import { BulkDiscountsService } from './bulk-discounts.service';

describe('BulkDiscountsService', () => {
  let service: BulkDiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkDiscountsService],
    }).compile();

    service = module.get<BulkDiscountsService>(BulkDiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
