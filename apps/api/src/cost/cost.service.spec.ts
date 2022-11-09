import { Test, TestingModule } from '@nestjs/testing';
import { CostService } from './cost.service';

describe('CostService', () => {
  let service: CostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostService],
    }).compile();

    service = module.get<CostService>(CostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
