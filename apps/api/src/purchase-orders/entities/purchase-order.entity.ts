import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { Contact } from "../../contacts/entities/contact.entity";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
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
    currentOrganisationId: number
    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.purchaseOrders)
    @JoinColumn({name: 'currentOrganisationId'})
    currentOrganisation: Organisation

    @Column({nullable: true})
    supplierId: number
    @ManyToOne(() => Organisation, supplier => supplier.receivedPurchaseOrders, {
        nullable: true
    })
    @JoinColumn({name: 'supplierId'})
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

    @OneToMany(() => DeliveryRequest, deliveryRequest => deliveryRequest.purchaseOrder)
    deliveryRequests: DeliveryRequest[];

    @ManyToMany(() => BatchLineItem, batchLineItem => batchLineItem.purchaseOrders)
    @JoinColumn()
    batchLineItems: BatchLineItem[];
}
