export class CreatePurchaseOrderLineItemDto {
    quantity: number;
    price: number;
    rawMaterialId?: number;
    finalGoodId?: number;
}
