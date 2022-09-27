import { Test, TestingModule } from '@nestjs/testing';
import { ProductionOrdersController } from './production-orders.controller';
import { ProductionOrdersService } from './production-orders.service';

describe('ProductionOrdersController', () => {
  let controller: ProductionOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionOrdersController],
      providers: [ProductionOrdersService],
    }).compile();

    controller = module.get<ProductionOrdersController>(
      ProductionOrdersController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
