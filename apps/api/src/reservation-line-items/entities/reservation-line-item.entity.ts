import { DeleteDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { LineItem } from "../../line-Items/LineItem";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

@Entity()
export class ReservationLineItem extends LineItem {
	@DeleteDateColumn()
	deletedDateTime: Date;

    @ManyToOne(() => BatchLineItem, batchLineItem => batchLineItem.reservationLineItems)
    batchLineItem: BatchLineItem;

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.reservationLineItems)
    purchaseOrder: PurchaseOrder;
}
