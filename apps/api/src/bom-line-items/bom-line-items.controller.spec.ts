import { Test, TestingModule } from '@nestjs/testing';
import { BomLineItemsController } from './bom-line-items.controller';
import { BomLineItemsService } from './bom-line-items.service';

describe('BomLineItemsController', () => {
  let controller: BomLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BomLineItemsController],
      providers: [BomLineItemsService],
    }).compile();

    controller = module.get<BomLineItemsController>(BomLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
