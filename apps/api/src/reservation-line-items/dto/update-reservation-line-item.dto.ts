import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationLineItemDto } from './create-reservation-line-item.dto';

export class UpdateReservationLineItemDto extends PartialType(CreateReservationLineItemDto) {}
