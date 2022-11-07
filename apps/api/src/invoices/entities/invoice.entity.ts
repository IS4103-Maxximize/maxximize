import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { InvoiceStatus } from "../enums/invoiceStatus.enum";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date
    
    @Column()
    amount: number

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.PENDING
    })
    status: InvoiceStatus

    @OneToOne(() => PurchaseOrder, po => po.invoice)
    @JoinColumn()
    po: PurchaseOrder
}
