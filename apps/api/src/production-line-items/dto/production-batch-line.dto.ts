import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";

export class ProductionBatchLineDto {
    batchLineItem: BatchLineItem;
    quantityToTake: number;
}