import { MeasurementUnit } from "../enums/measurementUnit.enum";

export class CreateProductDto {
    name: string;
    description: string;
    skuCode: string;
    unit?: MeasurementUnit;
    unitPrice: number;
    expiry: number;
}
