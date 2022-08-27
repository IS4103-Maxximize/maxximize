import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderProcessDto } from './create-order-process.dto';

export class UpdateOrderProcessDto extends PartialType(CreateOrderProcessDto) {}
