import { Test, TestingModule } from '@nestjs/testing';
import { RacksService } from './racks.service';

describe('RacksService', () => {
  let service: RacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RacksService],
    }).compile();

    service = module.get<RacksService>(RacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
