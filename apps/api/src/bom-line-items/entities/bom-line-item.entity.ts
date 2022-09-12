import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class BomLineItem extends LineItem {
    @ManyToOne(() => BillOfMaterial, billOfMaterial => billOfMaterial.bomLineItems)
    billOfMaterial: BillOfMaterial
}
