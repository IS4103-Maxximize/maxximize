import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BomLineItem } from "../../bom-line-items/entities/bom-line-item.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { ProductionLine } from "../../production-lines/entities/production-line.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";

@Entity()
export class BillOfMaterial {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => FinalGood, finalGood => finalGood.billOfMaterial, {onDelete: "CASCADE"})
    @JoinColumn()
    finalGood: FinalGood

    @OneToMany(() => BomLineItem, bomLineItem => bomLineItem.billOfMaterial, {cascade:true})
    bomLineItems: BomLineItem[]

    @OneToMany(() => ProductionOrder, productionOrder => productionOrder.bom)
    productionOrders: ProductionOrder[]

    @ManyToMany(() => ProductionLine, productionLine => productionLine.boms)
    productionLines: ProductionLine[]
}
