import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

export class CreateBomLineItemDto{
    quantity: number;
    rawMaterialId: number;
    billOfMaterialId?: number;
}
