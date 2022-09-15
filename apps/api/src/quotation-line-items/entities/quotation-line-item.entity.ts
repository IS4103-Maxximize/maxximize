import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";


@Entity()
export class QuotationLineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column()
    price: number

    @ManyToOne(() => RawMaterial)
    rawMaterial: RawMaterial

    @ManyToOne(() => FinalGood, { nullable: true })
    finalGood?: FinalGood

    @ManyToOne(() => Quotation, quotation => quotation.quotationLineItems, {onDelete: 'CASCADE'})
    quotation: Quotation
}
