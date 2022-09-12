import { Entity, ManyToOne } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class BatchLineItem extends LineItem {
    @ManyToOne(() => Batch, batch => batch.batchLineItems)
    batch: Batch;
}
