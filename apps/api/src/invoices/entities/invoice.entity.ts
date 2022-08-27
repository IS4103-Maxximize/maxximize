import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    billingDate: Date

    @Column()
    fulfillmentDate: Date
    
    @Column()
    amount: number

    @Column()
    billingAddress: string

    @OneToOne(() => Order, order => order.invoice)
    @JoinColumn()
    order: Order
}
