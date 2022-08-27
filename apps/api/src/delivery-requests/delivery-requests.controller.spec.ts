import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestsController } from './delivery-requests.controller';
import { DeliveryRequestsService } from './delivery-requests.service';

describe('DeliveryRequestsController', () => {
  let controller: DeliveryRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryRequestsController],
      providers: [DeliveryRequestsService],
    }).compile();

    controller = module.get<DeliveryRequestsController>(DeliveryRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
