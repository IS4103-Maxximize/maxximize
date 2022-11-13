import { Module } from '@nestjs/common';
import { ReservationLineItemsService } from './reservation-line-items.service';
import { ReservationLineItemsController } from './reservation-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationLineItem } from './entities/reservation-line-item.entity';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { BatchLineItemsModule } from '../batch-line-items/batch-line-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationLineItem, BatchLineItem]), BatchLineItemsModule],
  controllers: [ReservationLineItemsController],
  providers: [ReservationLineItemsService]
})
export class ReservationLineItemsModule {}
