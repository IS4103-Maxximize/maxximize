import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { GrLineItem } from "../../gr-line-items/entities/gr-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

@Entity()
export class GoodsReceipt {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdDateTime: Date;

    @Column()
    recipientName: string

    @Column()
    organisationId: number;

    @Column()
    description: string;

    @DeleteDateColumn()
    deletedDateTime: Date;

    @OneToMany(() => GrLineItem, grLineItem => grLineItem.goodReceipt)
    goodReceiptLineItems: GrLineItem[];

    @OneToOne(() => PurchaseOrder)
    @JoinColumn()
    purchaseOrder: PurchaseOrder;

    @OneToOne(() => Batch, batch => batch.goodReceipt) // delete batch when gr is deleted
    @JoinColumn()
    batch: Batch;
}
