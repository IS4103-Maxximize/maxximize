import { CreateFollowUpLineItemDto } from "../../follow-up-line-items/dto/create-follow-up-line-item.dto";
import { CreateGrLineItemDto } from "../../gr-line-items/dto/create-gr-line-item.dto";

export class CreateGoodsReceiptDto {
    recipientId: number;
    createdDateTime: Date;
    description: string;
    purchaseOrderId: number;
    goodsReceiptLineItemsDtos: CreateGrLineItemDto[];
    followUpLineItemsDtos: CreateFollowUpLineItemDto[];
}
