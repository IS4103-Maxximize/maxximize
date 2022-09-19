import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { SalesInquiryLineItem } from "../../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";
import { SalesInquiryStatus } from "../enums/salesInquiryStatus.enum";

@Entity()
export class SalesInquiry {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: SalesInquiryStatus
    })
    status: SalesInquiryStatus

    @Column()
    totalPrice: number

    @Column()
    created: Date

    @Column({nullable: true})
    currentOrganisationId: number
    @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.salesInquiries, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'currentOrganisationId'})
    currentOrganisation: Organisation

    @ManyToMany(() => ShellOrganisation, supplier => supplier.salesInquiries)
    suppliers: ShellOrganisation[]

    @OneToMany(() => Quotation, quotation => quotation.salesInquiry)
    quotations: Quotation[]

    @OneToMany(() => SalesInquiryLineItem, salesInquiryLineItem => salesInquiryLineItem.salesInquiry, {
        cascade: true
    })
    salesInquiryLineItems: SalesInquiryLineItem[]

    @OneToOne(() => Quotation, { nullable: true })
    chosenQuotation?: Quotation
}
