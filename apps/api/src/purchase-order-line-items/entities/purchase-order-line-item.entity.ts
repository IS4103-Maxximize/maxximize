import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrder } from "../../purchase-order/entities/purchase-order.entity";
import { Quotation } from "../../quotation/entities/quotation.entity";

Entity()
export class PurchaseOrderLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quotation, quotation => quotation.poLineItems)
  quotation: Quotation;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.poLineItems)
  purchaseOrder: PurchaseOrder;
}
