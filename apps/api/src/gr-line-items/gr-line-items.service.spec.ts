import { Test, TestingModule } from '@nestjs/testing';
import { GrLineItemsService } from './gr-line-items.service';

describe('GrLineItemsService', () => {
  let service: GrLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrLineItemsService],
    }).compile();

    service = module.get<GrLineItemsService>(GrLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
