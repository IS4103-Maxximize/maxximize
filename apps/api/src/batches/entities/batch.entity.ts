import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";

@Entity()
export class Batch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    batchNumber: string;

    @OneToMany(() => BatchLineItem, batchLineItem => batchLineItem.batch, {
        cascade: true
    })
    batchLineItems: BatchLineItem[];

    @OneToOne(() => GoodsReceipt, goodReceipt => goodReceipt.batch)
    goodReceipt: GoodsReceipt;
}
