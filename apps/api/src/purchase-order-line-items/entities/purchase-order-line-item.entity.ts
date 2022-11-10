import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class PurchaseOrderLineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column({
        default: 0
    })
    fufilledQty: number;

    @Column()
    price: number

    @ManyToOne(() => RawMaterial, { nullable: true })
    rawMaterial?: RawMaterial

    @ManyToOne(() => FinalGood, { nullable: true })
    finalGood?: FinalGood

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.poLineItems, {onDelete: 'CASCADE', nullable:true})
    purchaseOrder: PurchaseOrder
}

