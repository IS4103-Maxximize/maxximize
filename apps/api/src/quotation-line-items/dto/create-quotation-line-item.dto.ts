import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

export class CreateQuotationLineItemDto {
    quantity: number;
    price: number;
    rawMaterialId: number;
    finalGoodId?: number;
    quotationId: number;
}
