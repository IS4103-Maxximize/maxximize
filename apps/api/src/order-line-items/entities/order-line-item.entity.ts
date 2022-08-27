import { Entity, ManyToOne } from "typeorm";
import { LineItem } from "../../line-Items/LineItem";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class OrderLineItem extends LineItem {
    @ManyToOne(() => Order, order => order.orderLineItems)
    order: Order
}
