import { Test, TestingModule } from '@nestjs/testing';
import { RevenueBracketsService } from './revenue-brackets.service';

describe('RevenueBracketsService', () => {
  let service: RevenueBracketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenueBracketsService],
    }).compile();

    service = module.get<RevenueBracketsService>(RevenueBracketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
