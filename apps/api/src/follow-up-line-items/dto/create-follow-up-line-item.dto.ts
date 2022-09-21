export class CreateFollowUpLineItemDto {
    quantity: number;
    price: number;
    rawMaterialId: number;
    finalGoodId?: number;
    purchaseOrderId: number;
}
