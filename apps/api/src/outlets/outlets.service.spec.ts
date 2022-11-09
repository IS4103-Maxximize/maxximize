import { Test, TestingModule } from '@nestjs/testing';
import { OutletsService } from './outlets.service';

describe('OutletsService', () => {
  let service: OutletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutletsService],
    }).compile();

    service = module.get<OutletsService>(OutletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
