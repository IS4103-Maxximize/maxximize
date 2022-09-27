import { Test, TestingModule } from '@nestjs/testing';
import { ProductionLineItemsController } from './production-line-items.controller';
import { ProductionLineItemsService } from './production-line-items.service';

describe('ProductionLineItemsController', () => {
  let controller: ProductionLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionLineItemsController],
      providers: [ProductionLineItemsService],
    }).compile();

    controller = module.get<ProductionLineItemsController>(
      ProductionLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
