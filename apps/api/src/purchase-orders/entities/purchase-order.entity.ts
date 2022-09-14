import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    deliveryAddress: string

    @Column()
    totalPrice: number

    @Column()
    created: Date

    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.purchaseOrders, {onDelete: 'SET NULL'})
    currentOrganisation: Organisation

    @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.purchaseOrder)
    poLineItems: PurchaseOrderLineItem[]

    @OneToOne(() => Quotation, quotation => quotation.purchaseOrder)
    quotation: Quotation
}
