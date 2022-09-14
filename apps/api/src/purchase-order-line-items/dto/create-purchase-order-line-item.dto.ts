import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";

export class CreatePurchaseOrderLineItemDto {
    quantity: number;
    price: number;
    unit: MeasurementUnit;
    rawMaterial: RawMaterial;
    finalGood?: FinalGood;
    purchaseOrder: PurchaseOrder;
}
