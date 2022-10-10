import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";
import { QuotationLineItem } from "../../quotation-line-items/entities/quotation-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";

@Entity()
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    created: Date

    @Column()
    totalPrice: number

    @Column()
    leadTime: number

    @OneToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.quotation, { cascade:true, nullable: true })
    purchaseOrder?: PurchaseOrder

    @Column()
    currentOrganisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.sentQuotations)
    @JoinColumn({name: 'currentOrganisationId'})
    currentOrganisation: Organisation

    @Column({nullable: true})
    receivingOrganisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.receivedQuotations)
    @JoinColumn({name: 'receivingOrganisationId'})
    receivingOrganisation: Organisation

    @Column()
    salesInquiryId: number
    @ManyToOne(() => SalesInquiry, salesInquiry => salesInquiry.quotations)
    @JoinColumn({name: 'salesInquiryId'})
    salesInquiry: SalesInquiry

    @ManyToOne(() => ShellOrganisation, shellOrganisation => shellOrganisation.quotations, {onDelete: 'SET NULL'})
    shellOrganisation: ShellOrganisation

    @OneToMany(() => QuotationLineItem, quotationLineItem => quotationLineItem.quotation)
    quotationLineItems: QuotationLineItem[];
}
