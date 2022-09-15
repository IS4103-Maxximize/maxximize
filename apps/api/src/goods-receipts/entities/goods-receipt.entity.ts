import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToMany(() => GrLineItem, grLineItem => grLineItem.goodReceipt)
    goodReceiptLineItems: GrLineItem[];

    // @OneToOne(() => PurchaseOrder)
    // @JoinColumn()
    // purchaseOrder: PurchaseOrder;

    @OneToOne(() => Batch, batch => batch.goodReceipt) // delete batch when gr is deleted
    @JoinColumn()
    batch: Batch;
}
