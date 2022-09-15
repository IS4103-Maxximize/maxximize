import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";

@Entity()
export class SalesInquiryLineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column()
    indicativePrice: number

    @ManyToOne(() => RawMaterial)
    rawMaterial: RawMaterial

    @ManyToOne(() => SalesInquiry, salesInquiry => salesInquiry.salesInquiryLineItems, {onDelete: 'SET NULL'})
    salesInquiry: SalesInquiry
}