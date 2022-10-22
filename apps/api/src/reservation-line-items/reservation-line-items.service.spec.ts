import { Test, TestingModule } from '@nestjs/testing';
import { ReservationLineItemsService } from './reservation-line-items.service';

describe('ReservationLineItemsService', () => {
  let service: ReservationLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationLineItemsService],
    }).compile();

    service = module.get<ReservationLineItemsService>(ReservationLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
