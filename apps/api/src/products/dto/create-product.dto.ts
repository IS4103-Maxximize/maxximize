import { MeasurementUnit } from "../enums/measurementUnit.enum";

export class CreateProductDto {
    name: string;
    description: string;
    unit?: MeasurementUnit;
    unitPrice: number;
    expiry: number;
}
