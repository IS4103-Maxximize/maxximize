import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderLineItemDto } from './create-order-line-item.dto';

export class UpdateOrderLineItemDto extends PartialType(CreateOrderLineItemDto) {}
