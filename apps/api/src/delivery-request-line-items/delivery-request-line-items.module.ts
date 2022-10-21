import { Module } from '@nestjs/common';
import { DeliveryRequestLineItemsService } from './delivery-request-line-items.service';
import { DeliveryRequestLineItemsController } from './delivery-request-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRequestLineItem } from './entities/delivery-request-line-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryRequestLineItem])],
  controllers: [DeliveryRequestLineItemsController],
  providers: [DeliveryRequestLineItemsService]
})
export class DeliveryRequestLineItemsModule {}
