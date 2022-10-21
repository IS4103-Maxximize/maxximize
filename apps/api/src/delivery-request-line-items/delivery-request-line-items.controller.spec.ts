import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestLineItemsController } from './delivery-request-line-items.controller';
import { DeliveryRequestLineItemsService } from './delivery-request-line-items.service';

describe('DeliveryRequestLineItemsController', () => {
  let controller: DeliveryRequestLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryRequestLineItemsController],
      providers: [DeliveryRequestLineItemsService],
    }).compile();

    controller = module.get<DeliveryRequestLineItemsController>(DeliveryRequestLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
