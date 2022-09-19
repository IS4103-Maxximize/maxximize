import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
import { Invoice } from "../../invoices/entities/invoice.entity";
import { OrderLineItem } from "../../order-line-items/entities/order-line-item.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { QualityReview } from "../../quality-reviews/entities/quality-review.entity";
import { DeliveryType } from "../enums/DeliveryType.enum";
import { OrderStatus } from "../enums/OrderStatus.enum";
import { PaymentType } from "../enums/PaymentType.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    billingAddress: string

    @Column()
    created: Date

    @Column()
    delivered: Date

    @Column()
    deliveryAddress: string

    @Column()
    totalPrice: number

    @Column()
    discount: number

    @Column({
        type: 'enum',
        enum: PaymentType,
        default: PaymentType.VISA
    })
    paymentType: PaymentType

    @Column({
        type: 'enum',
        enum: DeliveryType,
        default: DeliveryType.LAND
    })
    deliveryType: DeliveryType

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: null
    })
    status: OrderStatus

    @ManyToOne(() => Organisation, organisation => organisation.salesOrders)
    supplier: Organisation

    @ManyToOne(() => Organisation, organisation => organisation.purchaseOrders)
    customer: Organisation

    @OneToOne(() => QualityReview, qualityReview => qualityReview.order)
    qualityReview: QualityReview

    @OneToOne(() => Invoice, invoice => invoice.order)
    invoice: Invoice

    @OneToMany(() => OrderLineItem, orderLineItem => orderLineItem.order)
    orderLineItems: OrderLineItem[]

    @OneToOne(() => DeliveryRequest, deliveryRequest => deliveryRequest.order)
    deliveryRequest: DeliveryRequest
}
