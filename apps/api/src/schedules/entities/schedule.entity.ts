import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductionLine } from "../../production-lines/entities/production-line.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { Machine } from "../../vehicles/entities/vehicle.entity";
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
    status: ScheduleType

    @Column({nullable: true})
    productionLineId: number
    @ManyToOne(() => ProductionLine, productionLine => productionLine.schedules)
    @JoinColumn({name: 'productionLineId'})
    productionLine: ProductionLine

    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.schedules, {onDelete: "CASCADE"})
    @JoinColumn()
    productionOrder: ProductionOrder
}
