import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { MeasurementUnit } from "../../products/enums/measurementUnit.enum";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

@Entity()
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    lotQuantity: number

    @Column()
    lotPrice: number

    @Column({
        type: 'enum',
        enum: MeasurementUnit
    })
    unit: MeasurementUnit;

    @ManyToOne(() => ShellOrganisation, shellOrganisation => shellOrganisation.quotations, {onDelete: 'SET NULL'})
    shellOrganisation: ShellOrganisation

    @ManyToOne(() => Product, product => product.quotations)
    product: Product

    @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.quotation)
    poLineItems: PurchaseOrderLineItem[];
}
