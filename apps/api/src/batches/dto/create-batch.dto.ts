import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";

export class CreateBatchDto {
    batchNumber: string;
    batchLineItems: BatchLineItem[];
    goodReceipt: GoodsReceipt;
}
