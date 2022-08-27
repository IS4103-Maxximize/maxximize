import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
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

    @Column()
    volumetricWeight: number;

    @ManyToMany(() => Vehicle, (vehicle) => vehicle.deliveryRequests)
    @JoinTable()
    vehicles: Vehicle;

    @OneToOne(() => Order, (order) => order.deliveryRequest)
    order: Order;
}
