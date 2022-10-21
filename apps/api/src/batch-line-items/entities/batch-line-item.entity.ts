import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { Bin } from "../../bins/entities/bin.entity";
import { LineItem } from "../../line-Items/LineItem";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

@Entity()
export class BatchLineItem extends LineItem {
    @Column()
    expiryDate: Date;

    @Column()
    code: string;

    @Column({default: 0})
    reservedQuantity: number;

    @DeleteDateColumn()
    deletedDateTime: Date;
    
    @ManyToOne(() => Batch, batch => batch.batchLineItems)
    batch: Batch;

    @ManyToOne(() => Bin, bin => bin.batchLineItems)
    bin: Bin

    @ManyToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.batchLineItems)
    purchaseOrders: PurchaseOrder[];
}
