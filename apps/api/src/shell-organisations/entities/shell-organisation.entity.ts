import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";

@Entity()
export class ShellOrganisation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    created: Date

    @Column()
    uen: number

    @OneToOne(() => Contact, contact => contact.shellOrganisation)
    contact: Contact

    @ManyToOne(() => Organisation, organisation => organisation.shellOrganisations)
    organisation: Organisation

    @OneToMany(() => Quotation, quotation => quotation.shellOrganisation)
    quotations: Quotation[]
}
