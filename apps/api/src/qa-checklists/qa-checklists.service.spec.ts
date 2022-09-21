import { Test, TestingModule } from '@nestjs/testing';
import { QaChecklistsService } from './qa-checklists.service';

describe('QaChecklistsService', () => {
  let service: QaChecklistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaChecklistsService],
    }).compile();

    service = module.get<QaChecklistsService>(QaChecklistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
