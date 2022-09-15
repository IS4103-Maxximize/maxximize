import { Test, TestingModule } from '@nestjs/testing';
import { SalesInquiryLineItemsController } from './sales-inquiry-line-items.controller';
import { SalesInquiryLineItemsService } from './sales-inquiry-line-items.service';

describe('SalesInquiryLineItemsController', () => {
  let controller: SalesInquiryLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesInquiryLineItemsController],
      providers: [SalesInquiryLineItemsService],
    }).compile();

    controller = module.get<SalesInquiryLineItemsController>(
      SalesInquiryLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
