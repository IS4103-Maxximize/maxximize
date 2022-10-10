import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { FollowUpLineItem } from "../../follow-up-line-items/entities/follow-up-line-item.entity";
import { GoodsReceipt } from "../../goods-receipts/entities/goods-receipt.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { PurchaseOrderStatus } from "../enums/purchaseOrderStatus.enum";

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: PurchaseOrderStatus
    })
    status: PurchaseOrderStatus

    @Column()
    deliveryAddress: string

    @Column()
    totalPrice: number

    @Column()
    created: Date

    @Column()
    deliveryDate: Date

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.purchaseOrders)
    @JoinColumn({name: 'organisationId'})
    currentOrganisation: Organisation

    @ManyToOne(() => Organisation, supplier => supplier.purchaseOrders, {
        nullable: true
    })
    supplier: Organisation

    @ManyToOne(() => Contact)
    orgContact: Contact

    @ManyToOne(() => Contact)
    userContact: Contact

    @ManyToOne(() => Contact)
    supplierContact: Contact

    @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.purchaseOrder, {cascade: true})
    poLineItems: PurchaseOrderLineItem[]

    @OneToMany(() => FollowUpLineItem, followUpLineItem => followUpLineItem.purchaseOrder, {cascade: true})
    followUpLineItems: FollowUpLineItem[]

    @OneToOne(() => Quotation, quotation => quotation.purchaseOrder, {onDelete: 'CASCADE'})
    @JoinColumn()
    quotation: Quotation

	@OneToMany(() => GoodsReceipt, goodsReceipt => goodsReceipt.purchaseOrder)
    @JoinColumn()
    goodsReceipts: GoodsReceipt[];
}
