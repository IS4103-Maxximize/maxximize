import { IsNotEmpty } from "class-validator";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";

export class CreateBatchDto {
    @IsNotEmpty()
    batchNumber: string;

    @IsNotEmpty()
    organisationId: number;
    
    @IsNotEmpty()
    batchLineItems: BatchLineItem[];

    @IsNotEmpty()
    goodReceipt: GoodsReceipt;
}
