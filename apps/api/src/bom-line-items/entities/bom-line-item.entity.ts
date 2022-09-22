import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class BomLineItem{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => RawMaterial)
    rawMaterial: RawMaterial

    @ManyToOne(() => BillOfMaterial, billOfMaterial => billOfMaterial.bomLineItems, {onDelete:"CASCADE", nullable:true})
    billOfMaterial?: BillOfMaterial
}
