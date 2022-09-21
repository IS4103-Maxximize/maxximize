import { Test, TestingModule } from '@nestjs/testing';
import { QaChecklistsController } from './qa-checklists.controller';
import { QaChecklistsService } from './qa-checklists.service';

describe('QaChecklistsController', () => {
  let controller: QaChecklistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaChecklistsController],
      providers: [QaChecklistsService],
    }).compile();

    controller = module.get<QaChecklistsController>(QaChecklistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
