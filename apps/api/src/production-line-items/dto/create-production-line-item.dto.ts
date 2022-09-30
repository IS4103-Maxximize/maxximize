import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

export class CreateProductionLineItemDto {
    quantity: number;
    sufficient?: boolean;
    batchLineItemId?: number;
    rawMaterial?: RawMaterial;
    productionOrderId?: number;
}
