import { Test, TestingModule } from '@nestjs/testing';
import { GrLineItemsController } from './gr-line-items.controller';
import { GrLineItemsService } from './gr-line-items.service';

describe('GrLineItemsController', () => {
  let controller: GrLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrLineItemsController],
      providers: [GrLineItemsService],
    }).compile();

    controller = module.get<GrLineItemsController>(GrLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
