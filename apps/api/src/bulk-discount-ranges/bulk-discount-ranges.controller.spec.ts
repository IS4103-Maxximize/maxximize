import { Test, TestingModule } from '@nestjs/testing';
import { BulkDiscountRangesController } from './bulk-discount-ranges.controller';
import { BulkDiscountRangesService } from './bulk-discount-ranges.service';

describe('BulkDiscountRangesController', () => {
  let controller: BulkDiscountRangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkDiscountRangesController],
      providers: [BulkDiscountRangesService],
    }).compile();

    controller = module.get<BulkDiscountRangesController>(BulkDiscountRangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
