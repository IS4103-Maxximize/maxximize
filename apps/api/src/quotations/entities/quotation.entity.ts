import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";
import { QuotationLineItem } from "../../quotation-line-items/entities/quotation-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";

@Entity()
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    created: Date

    @OneToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.quotation, { nullable: true })
    purchaseOrder: PurchaseOrder

    @ManyToOne(() => SalesInquiry, salesInquiry => salesInquiry.quotations)
    salesInquiry: SalesInquiry

    @ManyToOne(() => ShellOrganisation, shellOrganisation => shellOrganisation.quotations, {onDelete: 'SET NULL'})
    shellOrganisation: ShellOrganisation

    @OneToMany(() => QuotationLineItem, quotationLineItem => quotationLineItem.quotation)
    quotationLineItems: QuotationLineItem[];
}
