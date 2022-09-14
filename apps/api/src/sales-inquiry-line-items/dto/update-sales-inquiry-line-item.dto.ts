import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesInquiryLineItemDto } from './create-sales-inquiry-line-item.dto';

export class UpdateSalesInquiryLineItemDto extends PartialType(
  CreateSalesInquiryLineItemDto
) {
  quantity?: number;
  indicativePrice?: number;
}
