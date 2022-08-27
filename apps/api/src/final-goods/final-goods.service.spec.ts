import { Test, TestingModule } from '@nestjs/testing';
import { FinalGoodsService } from './final-goods.service';

describe('FinalGoodsService', () => {
  let service: FinalGoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalGoodsService],
    }).compile();

    service = module.get<FinalGoodsService>(FinalGoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
