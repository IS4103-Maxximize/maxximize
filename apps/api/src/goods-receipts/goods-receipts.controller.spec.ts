import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceiptsController } from './goods-receipts.controller';
import { GoodsReceiptsService } from './goods-receipts.service';

describe('GoodsReceiptsController', () => {
  let controller: GoodsReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsReceiptsController],
      providers: [GoodsReceiptsService],
    }).compile();

    controller = module.get<GoodsReceiptsController>(GoodsReceiptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
