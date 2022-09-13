import { PartialType } from '@nestjs/mapped-types';
import { PurchaseOrderLineItem } from '../../purchase-order-line-items/entities/purchase-order-line-item.entity';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto extends PartialType(
  CreatePurchaseOrderDto
) {
  deliveryAddress?: string;
  poLineItems?: PurchaseOrderLineItem[];
}
