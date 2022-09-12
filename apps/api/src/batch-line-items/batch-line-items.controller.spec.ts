import { Test, TestingModule } from '@nestjs/testing';
import { BatchLineItemsController } from './batch-line-items.controller';
import { BatchLineItemsService } from './batch-line-items.service';

describe('BatchLineItemsController', () => {
  let controller: BatchLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchLineItemsController],
      providers: [BatchLineItemsService],
    }).compile();

    controller = module.get<BatchLineItemsController>(BatchLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
