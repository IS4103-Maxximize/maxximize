import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowUpLineItemDto } from '../../follow-up-line-items/dto/create-follow-up-line-item.dto';
import { PurchaseOrderStatus } from '../enums/purchaseOrderStatus.enum';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto extends PartialType(
  CreatePurchaseOrderDto
) {
  followUpLineItemDtos?: CreateFollowUpLineItemDto[];
  status?: PurchaseOrderStatus;
}
