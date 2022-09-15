import { Entity, ManyToOne } from "typeorm";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class GrLineItem extends LineItem {

    @ManyToOne(() => GoodsReceipt, goodsReceipt => goodsReceipt.goodReceiptLineItems)
    goodReceipt: GoodsReceipt;

}
