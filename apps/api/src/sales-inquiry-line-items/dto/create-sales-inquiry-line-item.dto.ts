import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";

export class CreateSalesInquiryLineItemDto {
    quantity: number;
    indicativePrice: number;
    rawMaterialId: number;
    salesInquiryId: number;
}
