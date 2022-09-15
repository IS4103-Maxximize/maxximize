import { Test, TestingModule } from '@nestjs/testing';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';

describe('BinsController', () => {
  let controller: BinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinsController],
      providers: [BinsService],
    }).compile();

    controller = module.get<BinsController>(BinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
