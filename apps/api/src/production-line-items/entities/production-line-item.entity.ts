import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class ProductionLineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number

    @Column()
    sufficient: boolean

    @ManyToOne(() => BatchLineItem, {nullable: true})
    batchLineItem?: BatchLineItem

    @ManyToOne(() => RawMaterial, {nullable: true})
    rawMaterial: RawMaterial

    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.prodLineItems, {onDelete: "CASCADE"})
    productionOrder: ProductionOrder
}
