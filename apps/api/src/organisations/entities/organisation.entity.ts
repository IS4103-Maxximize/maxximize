import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrganisationType } from "../enums/organisationType.enum";
import { User } from "../../users/user.entity";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity()
export class Organisation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: OrganisationType
    })
    type: OrganisationType;

    @OneToMany(() => User, (user) => user.organisation, {
        cascade: ["remove"]
    })
    users: User[];

    @OneToOne(() => Contact, (contact) => contact.organisation)
    @JoinColumn()
    contact: Contact;

    @OneToMany(() => Machine, (machine) => machine.organisation)
    machines: Machine[];

    @OneToMany(() => Order, (order) => order.organisation)
    salesOrders: Order[];

    @OneToMany(() => Order, (order) => order.organisation)
    purchaseOrders: Order[];

    @OneToMany(() => Warehouse, (warehouse) => warehouse.organisation)
    warehouses: Warehouse[];

    @OneToMany(() => Billing, (billing) => billing.organisation)
    billings: Billing[];

}
