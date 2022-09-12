import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderLineItemsController } from './purchase-order-line-items.controller';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';

describe('PurchaseOrderLineItemsController', () => {
  let controller: PurchaseOrderLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderLineItemsController],
      providers: [PurchaseOrderLineItemsService],
    }).compile();

    controller = module.get<PurchaseOrderLineItemsController>(
      PurchaseOrderLineItemsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
