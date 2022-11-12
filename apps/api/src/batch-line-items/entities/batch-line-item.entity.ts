import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { Bin } from "../../bins/entities/bin.entity";
import { LineItem } from "../../line-Items/LineItem";
import { ProductionLineItem } from "../../production-line-items/entities/production-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { ReservationLineItem } from "../../reservation-line-items/entities/reservation-line-item.entity";

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
    bin: Bin;

    @OneToMany(() => ReservationLineItem, reservationLineItem => reservationLineItem.batchLineItem)
    reservationLineItems: ReservationLineItem[];

    @OneToMany(() => ProductionLineItem, productionLineItem => productionLineItem.batchLineItem)
    productionLineItems: ProductionLineItem[]
}
