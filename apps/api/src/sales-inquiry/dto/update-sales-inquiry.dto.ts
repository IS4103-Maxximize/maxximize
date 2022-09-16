import { PartialType } from '@nestjs/mapped-types';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { ShellOrganisation } from '../../shell-organisations/entities/shell-organisation.entity';
import { SalesInquiryStatus } from '../enums/salesInquiryStatus.enum';
import { CreateSalesInquiryDto } from './create-sales-inquiry.dto';

export class UpdateSalesInquiryDto extends PartialType(CreateSalesInquiryDto) {
    status?: SalesInquiryStatus;
    totalPrice?: number;
    quotations?: Quotation[];
    suppliers?: ShellOrganisation[];
    chosenQuotation?: Quotation;
}
