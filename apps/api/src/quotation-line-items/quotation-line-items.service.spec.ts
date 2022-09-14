import { Test, TestingModule } from '@nestjs/testing';
import { QuotationLineItemsService } from './quotation-line-items.service';

describe('QuotationLineItemsService', () => {
  let service: QuotationLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationLineItemsService],
    }).compile();

    service = module.get<QuotationLineItemsService>(QuotationLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
