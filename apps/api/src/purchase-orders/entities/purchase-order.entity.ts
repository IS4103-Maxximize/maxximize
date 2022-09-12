import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    deliveryAddress: string

    @Column()
    contact: Contact

    @Column()
    totalPrice: number

    @Column()
    createdDateTime: Date

    @ManyToOne(() => ShellOrganisation, supplierOrganisation => supplierOrganisation.purchaseOrders, {onDelete: 'SET NULL'})
    supplierOrganisation: ShellOrganisation

    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.purchaseOrders, {onDelete: 'SET NULL'})
    currentOrganisation: Organisation

    @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.purchaseOrder)
    poLineItems: PurchaseOrderLineItem[]
}
