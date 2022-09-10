import { Test, TestingModule } from '@nestjs/testing';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';

describe('QuotationsController', () => {
  let controller: QuotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationsController],
      providers: [QuotationsService],
    }).compile();

    controller = module.get<QuotationsController>(QuotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
