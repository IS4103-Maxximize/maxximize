import { Column, Entity, ManyToOne } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { Bin } from "../../bins/entities/bin.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class BatchLineItem extends LineItem {
    @Column()
    expiryDate: Date;

    @Column()
    reservedQuantity: number;
    
    @ManyToOne(() => Batch, batch => batch.batchLineItems)
    batch: Batch;

    @ManyToOne(() => Bin, bin => bin.batchLineItems)
    bin: Bin
}
