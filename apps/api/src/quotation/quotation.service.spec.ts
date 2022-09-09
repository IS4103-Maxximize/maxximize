import { Test, TestingModule } from '@nestjs/testing';
import { QuotationService } from './quotation.service';

describe('QuotationService', () => {
  let service: QuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationService],
    }).compile();

    service = module.get<QuotationService>(QuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
