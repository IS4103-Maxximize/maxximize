import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BomLineItem } from "../../bom-line-items/entities/bom-line-item.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";

@Entity()
export class BillOfMaterial {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => FinalGood, finalGood => finalGood.billOfMaterial, {onDelete: "CASCADE"})
    @JoinColumn()
    finalGood: FinalGood

    @OneToMany(() => BomLineItem, bomLineItem => bomLineItem.billOfMaterial, {cascade:true})
    bomLineItems: BomLineItem[]
}
