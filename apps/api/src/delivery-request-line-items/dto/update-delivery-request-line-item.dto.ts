import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryRequestLineItemDto } from './create-delivery-request-line-item.dto';

export class UpdateDeliveryRequestLineItemDto extends PartialType(CreateDeliveryRequestLineItemDto) {}
