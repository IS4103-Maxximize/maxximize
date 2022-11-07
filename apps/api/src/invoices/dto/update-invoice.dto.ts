import { PartialType } from '@nestjs/mapped-types';
import { InvoiceStatus } from '../enums/invoiceStatus.enum';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    status: InvoiceStatus
}
