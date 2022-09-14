import { Test, TestingModule } from '@nestjs/testing';
import { SalesInquiryController } from './sales-inquiry.controller';
import { SalesInquiryService } from './sales-inquiry.service';

describe('SalesInquiryController', () => {
  let controller: SalesInquiryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesInquiryController],
      providers: [SalesInquiryService],
    }).compile();

    controller = module.get<SalesInquiryController>(SalesInquiryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
