import { CreateGrLineItemDto } from "../../gr-line-items/dto/create-gr-line-item.dto";

export class CreateGoodsReceiptDto {
    recipientId: number;
    createdDateTime: Date;
    description: string;
    purchaseOrderId: number;
    goodsReceiptLineItemsDtos: CreateGrLineItemDto[];
}
