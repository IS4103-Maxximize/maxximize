import { Test, TestingModule } from '@nestjs/testing';
import { BinsService } from './bins.service';

describe('BinsService', () => {
  let service: BinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinsService],
    }).compile();

    service = module.get<BinsService>(BinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
