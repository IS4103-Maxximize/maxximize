import { Test, TestingModule } from '@nestjs/testing';
import { CartLineItemsController } from './cart-line-items.controller';
import { CartLineItemsService } from './cart-line-items.service';

describe('CartLineItemsController', () => {
  let controller: CartLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartLineItemsController],
      providers: [CartLineItemsService],
    }).compile();

    controller = module.get<CartLineItemsController>(CartLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
