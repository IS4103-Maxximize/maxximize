import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleLineItemsController } from './schedule-line-items.controller';
import { ScheduleLineItemsService } from './schedule-line-items.service';

describe('ScheduleLineItemsController', () => {
  let controller: ScheduleLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleLineItemsController],
      providers: [ScheduleLineItemsService],
    }).compile();

    controller = module.get<ScheduleLineItemsController>(
      ScheduleLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
