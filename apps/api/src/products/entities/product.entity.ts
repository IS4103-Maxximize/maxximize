import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
}
