import { PartialType } from '@nestjs/mapped-types';
import { CreateCartLineItemDto } from './create-cart-line-item.dto';

export class UpdateCartLineItemDto extends PartialType(CreateCartLineItemDto) {}
