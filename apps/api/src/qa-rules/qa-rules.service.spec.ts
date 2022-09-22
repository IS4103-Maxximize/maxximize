import { Test, TestingModule } from '@nestjs/testing';
import { QaRulesService } from './qa-rules.service';

describe('QaRulesService', () => {
  let service: QaRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaRulesService],
    }).compile();

    service = module.get<QaRulesService>(QaRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
