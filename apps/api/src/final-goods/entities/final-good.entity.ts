import { Column, Entity, OneToOne } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";

@Entity()
export class FinalGood extends Product {

    @Column()
    lotQuantity: number

    @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.finalGood)
    billOfMaterial: BillOfMaterial
}
