import { Test, TestingModule } from '@nestjs/testing';
import { SalesInquiryLineItemsService } from './sales-inquiry-line-items.service';

describe('SalesInquiryLineItemsService', () => {
  let service: SalesInquiryLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesInquiryLineItemsService],
    }).compile();

    service = module.get<SalesInquiryLineItemsService>(
      SalesInquiryLineItemsService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
