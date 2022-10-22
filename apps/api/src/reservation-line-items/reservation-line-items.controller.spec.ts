import { Test, TestingModule } from '@nestjs/testing';
import { ReservationLineItemsController } from './reservation-line-items.controller';
import { ReservationLineItemsService } from './reservation-line-items.service';

describe('ReservationLineItemsController', () => {
  let controller: ReservationLineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationLineItemsController],
      providers: [ReservationLineItemsService],
    }).compile();

    controller = module.get<ReservationLineItemsController>(ReservationLineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
