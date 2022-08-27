import { Column, Entity, ManyToMany } from "typeorm";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
import { Machine } from "../../machines/machine";
import { VehicleStatus } from "../enums/vehicleStatus.enum";

@Entity()
export class Vehicle extends Machine {
    @Column()
    licensePlate: string;

    @Column()
    loadCapacity: number;

    @Column()
    location: string;

    @Column({
        type: 'enum',
        enum: VehicleStatus
    })
    currentStatus: VehicleStatus;

    @ManyToMany(() => DeliveryRequest, (deliveryRequest) => deliveryRequest.vehicles)
    deliveryRequests: DeliveryRequest[];
}
