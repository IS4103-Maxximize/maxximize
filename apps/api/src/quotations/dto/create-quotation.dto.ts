import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

export class CreateQuotationDto {
    salesInquiry: SalesInquiry;
    shellOrganisation: ShellOrganisation;
}
