import { Test, TestingModule } from '@nestjs/testing';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';

describe('QuotationController', () => {
  let controller: QuotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationController],
      providers: [QuotationService],
    }).compile();

    controller = module.get<QuotationController>(QuotationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
