import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceiptsService } from './goods-receipts.service';

describe('GoodsReceiptsService', () => {
  let service: GoodsReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsReceiptsService],
    }).compile();

    service = module.get<GoodsReceiptsService>(GoodsReceiptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
