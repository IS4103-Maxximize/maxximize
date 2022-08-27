import { Column, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../organisations/entities/organisation.entity";
import { Schedule } from "../schedules/entities/schedule.entity";
import { Sensor } from "../sensors/entities/sensor.entity";

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
    organisations: Organisation[];

    @OneToMany(() => Schedule, (schedule) => schedule.machine)
    schedules: Schedule[];

    @OneToOne(() => Sensor, (sensor) => sensor.machine)
    sensor: Sensor;
}