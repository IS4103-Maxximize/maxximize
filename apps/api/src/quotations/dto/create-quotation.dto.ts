import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

export class CreateQuotationDto {
    salesInquiryId: number;
    shellOrganisationId?: number;
    leadTime: number;
    currentOrganisationId: number
    receivingOrganisationId?: number
}
