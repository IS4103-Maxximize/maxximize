import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "../../machines/machine";
import { ScheduleType } from "../enums/scheduleType.enum";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column({
        type: 'enum',
        enum: ScheduleType
    })
    type: ScheduleType;

    @ManyToOne(() => Machine, (machine) => machine.schedules, {
        onDelete: 'CASCADE'
    })
    machine: Machine;
}
