import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';

describe('PurchaseOrderLineItemsService', () => {
  let service: PurchaseOrderLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseOrderLineItemsService],
    }).compile();

    service = module.get<PurchaseOrderLineItemsService>(
      PurchaseOrderLineItemsService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
