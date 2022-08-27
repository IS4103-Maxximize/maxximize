import { Test, TestingModule } from '@nestjs/testing';
import { OrderLineItemsService } from './order-line-items.service';

describe('OrderLineItemsService', () => {
  let service: OrderLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderLineItemsService],
    }).compile();

    service = module.get<OrderLineItemsService>(OrderLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
