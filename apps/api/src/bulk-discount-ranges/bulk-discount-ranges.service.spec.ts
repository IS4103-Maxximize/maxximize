import { Test, TestingModule } from '@nestjs/testing';
import { BulkDiscountRangesService } from './bulk-discount-ranges.service';

describe('BulkDiscountRangesService', () => {
  let service: BulkDiscountRangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkDiscountRangesService],
    }).compile();

    service = module.get<BulkDiscountRangesService>(BulkDiscountRangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
