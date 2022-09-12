import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";

@Entity()
export class PurchaseOrderLineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column()
    subTotal: number

    @Column()
    organisationRawMaterialId: number

    @Column()
    supplierFinalGoodId: number

    @ManyToOne(() => Quotation, quotation => quotation.poLineItems, {onDelete: 'SET NULL'})
    quotation: Quotation

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.poLineItem, {onDelete: 'SET NULL'})
    purchaseOrder: PurchaseOrder
}

