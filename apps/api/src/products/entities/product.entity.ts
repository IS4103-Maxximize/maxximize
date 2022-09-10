import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { MeasurementUnit } from "../enums/measurementUnit.enum";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    skuCode: string

    @Column({
        type: 'enum',
        enum: MeasurementUnit
    })
    unit?: MeasurementUnit;

    @Column()
    unitPrice: number;

    @Column()
    expiry: number;

    @OneToMany(() => Quotation, quotation => quotation.product)
    quotations: Quotation[]
}
