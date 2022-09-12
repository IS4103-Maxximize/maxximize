import { Quotation } from "../../quotations/entities/quotation.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

export class CreatePurchaseOrderLineItemDto {
    quantity: number;
    subTotal: number;
    organisationRawMaterialId: number;
    supplierFinalGoodId: number;
    quotation: Quotation;
    purchaseOrder: PurchaseOrder;
}
