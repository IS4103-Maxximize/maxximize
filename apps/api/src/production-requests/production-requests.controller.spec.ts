import { Test, TestingModule } from '@nestjs/testing';
import { ProductionRequestsController } from './production-requests.controller';
import { ProductionRequestsService } from './production-requests.service';

describe('ProductionRequestsController', () => {
  let controller: ProductionRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionRequestsController],
      providers: [ProductionRequestsService],
    }).compile();

    controller = module.get<ProductionRequestsController>(
      ProductionRequestsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
