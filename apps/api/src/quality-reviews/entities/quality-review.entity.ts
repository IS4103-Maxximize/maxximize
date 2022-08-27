import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class QualityReview {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    reviewResult: Boolean

    @Column()
    content: string

    @Column()
    reviewDate: Date

    @OneToOne(() => Order, order => order.qualityReview)
    @JoinColumn()
    order: Order
}
