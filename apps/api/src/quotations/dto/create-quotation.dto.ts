import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";

export class CreateQuotationDto {
    lotQuantity: number;
    lotPrice: number;
    unit: MeasurementUnit;
    shellOrganisationId: number;
    productCode: number
}
