import { Module } from '@nestjs/common';
import { DeliveryRequestsService } from './delivery-requests.service';
import { DeliveryRequestsController } from './delivery-requests.controller';

@Module({
  controllers: [DeliveryRequestsController],
  providers: [DeliveryRequestsService]
})
export class DeliveryRequestsModule {}
