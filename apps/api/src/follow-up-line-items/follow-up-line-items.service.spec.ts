import { Test, TestingModule } from '@nestjs/testing';
import { FollowUpLineItemsService } from './follow-up-line-items.service';

describe('FollowUpLineItemsService', () => {
  let service: FollowUpLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowUpLineItemsService],
    }).compile();

    service = module.get<FollowUpLineItemsService>(FollowUpLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
