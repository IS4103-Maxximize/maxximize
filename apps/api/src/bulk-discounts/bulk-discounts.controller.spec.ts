import { Test, TestingModule } from '@nestjs/testing';
import { BulkDiscountsController } from './bulk-discounts.controller';
import { BulkDiscountsService } from './bulk-discounts.service';

describe('BulkDiscountsController', () => {
  let controller: BulkDiscountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkDiscountsController],
      providers: [BulkDiscountsService],
    }).compile();

    controller = module.get<BulkDiscountsController>(BulkDiscountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
