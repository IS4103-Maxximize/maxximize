import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryRequestLineItem } from "../../delivery-request-line-items/entities/delivery-request-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { User } from "../../users/entities/user.entity";
import { Vehicle } from "../../vehicles/entities/vehicle.entity";
import { DeliveryRequestStatus } from "../enums/deliveryRequestStatus.enum";

@Entity()
export class DeliveryRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    addressTo: string;

    @Column()
    addressFrom: string;

    @Column()
    dateCreated: Date;

    @Column({
        type: 'enum',
        enum: DeliveryRequestStatus
    })
    status: DeliveryRequestStatus;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.deliveryRequests)
    vehicle: Vehicle;

    @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.deliveryRequests)
    purchaseOrder: PurchaseOrder;

    @ManyToOne(() => User, (user) => user.deliveryRequests)
    user: User;

    @OneToMany(() => DeliveryRequestLineItem, deliveryRequestLineItem => deliveryRequestLineItem.deliveryRequest, {
        cascade: true
    })
    deliveryRequestLineItems: DeliveryRequestLineItem[];
}
