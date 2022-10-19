import { Test, TestingModule } from '@nestjs/testing';
import { ChronJobsService } from './chron-jobs.service';

describe('ChronJobsService', () => {
  let service: ChronJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChronJobsService],
    }).compile();

    service = module.get<ChronJobsService>(ChronJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
