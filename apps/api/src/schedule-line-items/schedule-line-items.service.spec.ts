import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleLineItemsService } from './schedule-line-items.service';

describe('ScheduleLineItemsService', () => {
  let service: ScheduleLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleLineItemsService],
    }).compile();

    service = module.get<ScheduleLineItemsService>(ScheduleLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
