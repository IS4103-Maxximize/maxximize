import { Test, TestingModule } from '@nestjs/testing';
import { OutletsController } from './outlets.controller';
import { OutletsService } from './outlets.service';

describe('OutletsController', () => {
  let controller: OutletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutletsController],
      providers: [OutletsService],
    }).compile();

    controller = module.get<OutletsController>(OutletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
