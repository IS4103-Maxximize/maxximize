import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesInquiryDto } from './create-sales-inquiry.dto';

export class UpdateSalesInquiryDto extends PartialType(CreateSalesInquiryDto) {}
