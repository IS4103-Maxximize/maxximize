import { GrLineItem } from "../../gr-line-items/entities/gr-line-item.entity";

export class CreateGoodsReceiptDto {
    recipientId: number;
    createdDateTime: Date;
    purchaseOrderId: number;
    goodsReceiptLineItems: GrLineItem[];
}
