import { Test, TestingModule } from '@nestjs/testing';
import { ChronJobsController } from './chron-jobs.controller';
import { ChronJobsService } from './chron-jobs.service';

describe('ChronJobsController', () => {
  let controller: ChronJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChronJobsController],
      providers: [ChronJobsService],
    }).compile();

    controller = module.get<ChronJobsController>(ChronJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
