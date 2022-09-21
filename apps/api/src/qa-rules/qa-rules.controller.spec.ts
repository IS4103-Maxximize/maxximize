import { Test, TestingModule } from '@nestjs/testing';
import { QaRulesController } from './qa-rules.controller';
import { QaRulesService } from './qa-rules.service';

describe('QaRulesController', () => {
  let controller: QaRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaRulesController],
      providers: [QaRulesService],
    }).compile();

    controller = module.get<QaRulesController>(QaRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
