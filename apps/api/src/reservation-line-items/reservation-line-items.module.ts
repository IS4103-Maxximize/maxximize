import { Module } from '@nestjs/common';
import { ReservationLineItemsService } from './reservation-line-items.service';
import { ReservationLineItemsController } from './reservation-line-items.controller';

@Module({
  controllers: [ReservationLineItemsController],
  providers: [ReservationLineItemsService]
})
export class ReservationLineItemsModule {}
