import { Test, TestingModule } from '@nestjs/testing';
import { BatchLineItemsService } from './batch-line-items.service';

describe('BatchLineItemsService', () => {
  let service: BatchLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchLineItemsService],
    }).compile();

    service = module.get<BatchLineItemsService>(BatchLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
