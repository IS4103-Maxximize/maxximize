import { Test, TestingModule } from '@nestjs/testing';
import { FinalGoodsController } from './final-goods.controller';
import { FinalGoodsService } from './final-goods.service';

describe('FinalGoodsController', () => {
  let controller: FinalGoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalGoodsController],
      providers: [FinalGoodsService],
    }).compile();

    controller = module.get<FinalGoodsController>(FinalGoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
