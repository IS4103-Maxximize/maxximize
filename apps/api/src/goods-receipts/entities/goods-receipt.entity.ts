import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { GrLineItem } from "../../gr-line-items/entities/gr-line-item.entity";

@Entity()
export class GoodsReceipt {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdDateTime: Date;

    @Column()
    recipientName: string

    @ManyToOne(() => GrLineItem, grLineItem => grLineItem.goodReceipt, {
        cascade: true
    })
    goodReceiptLineItems: GrLineItem[];

    // @OneToOne(() => PurchaseOrder)
    // @JoinColumn()
    // purchaseOrder: PurchaseOrder;

    @OneToOne(() => Batch, batch => batch.goodReceipt)
    batch: Batch;
}
