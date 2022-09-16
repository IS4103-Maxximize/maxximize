import { PartialType } from '@nestjs/mapped-types';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { QuotationLineItem } from '../../quotation-line-items/entities/quotation-line-item.entity';
import { CreateQuotationDto } from './create-quotation.dto';

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {
    totalPrice?: number;
    purchaseOrder?: PurchaseOrder;
    quotationLineItems?: QuotationLineItem[];
}
