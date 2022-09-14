import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { OrganisationType } from "../../organisations/enums/organisationType.enum";
import { Quotation } from "../../quotations/entities/quotation.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

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

    @ManyToOne(() => Organisation, organisation => organisation.shellOrganisations)
    organisation: Organisation

    @OneToMany(() => Quotation, quotation => quotation.shellOrganisation)
    quotations: Quotation[]

    @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.supplierOrganisation)
    purchaseOrders: PurchaseOrder[];
}
