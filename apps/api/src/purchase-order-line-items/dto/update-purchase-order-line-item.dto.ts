import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderLineItemDto } from './create-purchase-order-line-item.dto';

export class UpdatePurchaseOrderLineItemDto extends PartialType(
  CreatePurchaseOrderLineItemDto
) {
  quantity?: number;
  price?: number;
}
