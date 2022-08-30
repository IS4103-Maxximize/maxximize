import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "../../vehicles/entities/vehicle.entity";

@Entity()
export class Sensor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    temperature: number;

    @Column()
    humidity: number;

    @OneToOne(() => Machine, (machine) => machine.sensor, {
        onDelete: 'CASCADE'
    })
    machine: Machine;
}
