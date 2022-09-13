import { Test, TestingModule } from '@nestjs/testing';
import { SalesInquiryService } from './sales-inquiry.service';

describe('SalesInquiryService', () => {
  let service: SalesInquiryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesInquiryService],
    }).compile();

    service = module.get<SalesInquiryService>(SalesInquiryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
