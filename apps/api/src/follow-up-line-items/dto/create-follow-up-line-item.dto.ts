export class CreateFollowUpLineItemDto {
    quantity: number;
    rawMaterialId: number;
    finalGoodId?: number;
    purchaseOrderId: number;
    unitPrice: number;
}
