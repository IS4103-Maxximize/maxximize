import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductionLineItem } from "../../production-line-items/entities/production-line-item.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";

@Entity()
export class ScheduleLineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ProductionLineItem)
    prodLineItem: ProductionLineItem;

    @ManyToOne(() => Schedule, schedule => schedule.scheduleLineItems)
    schedule: Schedule
}
