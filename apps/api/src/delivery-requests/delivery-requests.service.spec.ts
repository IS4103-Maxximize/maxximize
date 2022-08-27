import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestsService } from './delivery-requests.service';

describe('DeliveryRequestsService', () => {
  let service: DeliveryRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryRequestsService],
    }).compile();

    service = module.get<DeliveryRequestsService>(DeliveryRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
