import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { MeasurementUnit } from "../enums/measurementUnit.enum";

@Entity()
@TableInheritance({
    column: {
        type: "varchar",
        name: "type"
    }
})
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({nullable: true})
    skuCode: string

    @Column({
        type: 'enum',
        enum: MeasurementUnit
    })
    unit?: MeasurementUnit;

    @Column()
    unitPrice: number;

    @Column({nullable: true})
    expiry: number;

    @OneToMany(() => Quotation, quotation => quotation.product)
    quotations: Quotation[]
}
