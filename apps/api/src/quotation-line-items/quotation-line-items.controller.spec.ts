import { Test, TestingModule } from '@nestjs/testing';
import { QuotationLineItemsController } from './quotation-line-items.controller';
import { QuotationLineItemsService } from './quotation-line-items.service';

describe('QuotationLineItemsController', () => {
  let controller: QuotationLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationLineItemsController],
      providers: [QuotationLineItemsService],
    }).compile();

    controller = module.get<QuotationLineItemsController>(
      QuotationLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
