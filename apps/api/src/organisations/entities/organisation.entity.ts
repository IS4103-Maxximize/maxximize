import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrganisationType } from "../enums/organisationType.enum";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";
import { Contact } from "../../contacts/entities/contact.entity";
import { User } from "../../users/entities/user.entity";
import { Order } from "../../orders/entities/order.entity";
import { Billing } from "../../billings/entities/billing.entity";
import { Machine } from "../../vehicles/entities/vehicle.entity";

@Entity()
export class Organisation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;
  
    @Column({default: "true"})
    isActive: string;

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

    @OneToMany(() => Order, (order) => order.customer)
    salesOrders: Order[];

    @OneToMany(() => Order, (order) => order.supplier)
    purchaseOrders: Order[];

    @OneToMany(() => Warehouse, (warehouse) => warehouse.organisation)
    warehouses: Warehouse[];

    @OneToMany(() => Billing, (billing) => billing.organisation)
    billings: Billing[];

}
