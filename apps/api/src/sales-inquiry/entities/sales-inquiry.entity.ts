import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { SalesInquiryLineItem } from "../../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";
import { SalesInquiryStatus } from "../enums/salesInquiryStatus.enum";

@Entity()
export class SalesInquiry {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    status: SalesInquiryStatus

    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.salesInquiries, {onDelete: 'SET NULL'})
    currentOrganisation: Organisation

    @ManyToMany(() => ShellOrganisation, supplier => supplier.salesInquiries, {onDelete: 'SET NULL'})
    suppliers: ShellOrganisation[]

    @OneToMany(() => Quotation, quotation => quotation.salesInquiry)
    quotations: Quotation[]

    @OneToMany(() => SalesInquiryLineItem, salesInquiryLineItem => salesInquiryLineItem.salesInquiry)
    salesInquiryLineItems: SalesInquiryLineItem[]

    @OneToOne(() => Quotation, { nullable: true })
    chosenQuotation: Quotation
}
