import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";

@Entity()
export class Batch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    batchNumber: string;

    @Column()
    organisationId: number;

    @OneToMany(() => BatchLineItem, batchLineItem => batchLineItem.batch, {
        cascade: true
    })
    batchLineItems: BatchLineItem[];

    @OneToOne(() => GoodsReceipt, goodsReceipt => goodsReceipt.batch, {
        onDelete: 'CASCADE'
    })
    goodsReceipt: GoodsReceipt;

    @OneToOne(() => Schedule, schedule => schedule.completedGoods)
    schedule: Schedule


}
