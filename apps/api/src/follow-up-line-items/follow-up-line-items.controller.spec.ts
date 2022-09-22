import { Test, TestingModule } from '@nestjs/testing';
import { FollowUpLineItemsController } from './follow-up-line-items.controller';
import { FollowUpLineItemsService } from './follow-up-line-items.service';

describe('FollowUpLineItemsController', () => {
  let controller: FollowUpLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowUpLineItemsController],
      providers: [FollowUpLineItemsService],
    }).compile();

    controller = module.get<FollowUpLineItemsController>(
      FollowUpLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
