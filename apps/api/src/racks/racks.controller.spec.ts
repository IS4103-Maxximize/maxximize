import { Test, TestingModule } from '@nestjs/testing';
import { RacksController } from './racks.controller';
import { RacksService } from './racks.service';

describe('RacksController', () => {
  let controller: RacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RacksController],
      providers: [RacksService],
    }).compile();

    controller = module.get<RacksController>(RacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
