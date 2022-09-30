import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequisitionsController } from './purchase-requisitions.controller';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';

describe('PurchaseRequisitionsController', () => {
  let controller: PurchaseRequisitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseRequisitionsController],
      providers: [PurchaseRequisitionsService],
    }).compile();

    controller = module.get<PurchaseRequisitionsController>(PurchaseRequisitionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
