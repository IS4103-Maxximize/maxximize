import { PartialType } from '@nestjs/mapped-types';
import { DeliveryRequestStatus } from '../enums/deliveryRequestStatus.enum';
import { CreateDeliveryRequestDto } from './create-delivery-request.dto';

export class UpdateDeliveryRequestDto extends PartialType(CreateDeliveryRequestDto) {
    status: DeliveryRequestStatus;
}
