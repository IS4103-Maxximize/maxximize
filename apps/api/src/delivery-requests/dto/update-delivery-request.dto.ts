import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryRequestDto } from './create-delivery-request.dto';

export class UpdateDeliveryRequestDto extends PartialType(CreateDeliveryRequestDto) {}
