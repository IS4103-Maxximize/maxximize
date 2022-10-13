import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { OrganisationType } from "../../organisations/enums/organisationType.enum";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity";

@Entity()
export class ShellOrganisation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    //SUPPLIER OR RETAILER
    @Column({
        type: 'enum',
        enum: OrganisationType,
        nullable: false
    })
    type: OrganisationType;

    @Column()
    created: Date

    @Column({unique: true})
    uen: string

    @OneToOne(() => Contact, contact => contact.shellOrganisation)
    contact: Contact

    @Column()
    parentOrganisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.shellOrganisations)
    @JoinColumn({name: 'parentOrganisationId'})
    parentOrganisation?: Organisation

    @OneToMany(() => Quotation, quotation => quotation.shellOrganisation)
    quotations: Quotation[]

    @ManyToMany(() => SalesInquiry, salesInquiry => salesInquiry.suppliers)
    @JoinTable()
    salesInquiries: SalesInquiry[]

    @ManyToMany(() => RawMaterial, rawMaterial => rawMaterial.suppliers)
    @JoinTable()
    rawMaterials: RawMaterial[]

}
