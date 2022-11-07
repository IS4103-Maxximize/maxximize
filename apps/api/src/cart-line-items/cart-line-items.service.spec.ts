import { Test, TestingModule } from '@nestjs/testing';
import { CartLineItemsService } from './cart-line-items.service';

describe('CartLineItemsService', () => {
  let service: CartLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartLineItemsService],
    }).compile();

    service = module.get<CartLineItemsService>(CartLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
