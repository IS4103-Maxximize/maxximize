import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Sensor } from "../../sensors/entities/sensor.entity";
import { VehicleStatus } from "../enums/vehicleStatus.enum";

@Entity()
export abstract class Machine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({default: false})
    isOperating: boolean;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: Date;

    @Column()
    lastServiced: Date;

    @Column()
    remarks: string;

    @ManyToOne(() => Organisation, (organisation) => organisation.machines, {
        onDelete: 'CASCADE'
    })
    organisation: Organisation;

    @OneToOne(() => Sensor, (sensor) => sensor.machine)
    sensor: Sensor;
}

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

    @ManyToMany(() => DeliveryRequest, (deliveryRequest) => deliveryRequest.vehicles, {
        nullable: true
    })
    deliveryRequests: DeliveryRequest[];
}
