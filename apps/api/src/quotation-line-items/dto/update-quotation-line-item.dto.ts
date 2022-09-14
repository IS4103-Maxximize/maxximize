import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationLineItemDto } from './create-quotation-line-item.dto';

export class UpdateQuotationLineItemDto extends PartialType(
  CreateQuotationLineItemDto
) {
  quantity?: number;
  price?: number;
}
