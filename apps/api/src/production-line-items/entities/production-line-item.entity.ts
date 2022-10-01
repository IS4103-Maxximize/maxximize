import { Column, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { PurchaseRequisition } from "../../purchase-requisitions/entities/purchase-requisition.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class ProductionLineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number

    @Column({default:true})
    sufficient: boolean

    @DeleteDateColumn()
    deletedDateTime: Date;

    @ManyToOne(() => BatchLineItem, {nullable: true})
    batchLineItem?: BatchLineItem

    @ManyToOne(() => RawMaterial, {nullable: true})
    rawMaterial?: RawMaterial

    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.prodLineItems, {onDelete: "CASCADE", cascade: true})
    productionOrder: ProductionOrder

    @OneToOne(() => PurchaseRequisition, purchaseRequisition => purchaseRequisition.productionLineItem)
    purchaseRequisition: PurchaseRequisition;

    @DeleteDateColumn()
    deletedAt: Date;
}
