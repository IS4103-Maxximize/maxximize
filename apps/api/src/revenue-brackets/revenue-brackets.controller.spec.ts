import { Test, TestingModule } from '@nestjs/testing';
import { RevenueBracketsController } from './revenue-brackets.controller';
import { RevenueBracketsService } from './revenue-brackets.service';

describe('RevenueBracketsController', () => {
  let controller: RevenueBracketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueBracketsController],
      providers: [RevenueBracketsService],
    }).compile();

    controller = module.get<RevenueBracketsController>(RevenueBracketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
