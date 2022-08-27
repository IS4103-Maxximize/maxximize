import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class BomLineItem extends LineItem {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Batch, batch => batch.bomLineItems)
    @JoinTable()
    batches: Batch[]

    @ManyToOne(() => BillOfMaterial, billOfMaterial => billOfMaterial.bomLineItems)
    billOfMaterial: BillOfMaterial
}
