import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestLineItemsService } from './delivery-request-line-items.service';

describe('DeliveryRequestLineItemsService', () => {
  let service: DeliveryRequestLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryRequestLineItemsService],
    }).compile();

    service = module.get<DeliveryRequestLineItemsService>(DeliveryRequestLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
