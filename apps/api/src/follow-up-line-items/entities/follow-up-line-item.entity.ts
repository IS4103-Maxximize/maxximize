import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { LineItem } from "../../line-Items/LineItem";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class FollowUpLineItem extends LineItem {
    @ManyToOne(() => RawMaterial)
    rawMaterial: RawMaterial

    @ManyToOne(() => FinalGood, { nullable: true })
    finalGood?: FinalGood

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.followUpLineItems, {onDelete: 'CASCADE'})
    purchaseOrder?: PurchaseOrder
}
