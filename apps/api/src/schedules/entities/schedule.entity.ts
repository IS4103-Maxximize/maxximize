import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { ProductionLine } from "../../production-lines/entities/production-line.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
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
    @ManyToOne(() => ProductionLine, productionLine => productionLine.schedules, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'productionLineId'})
    productionLine: ProductionLine

    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.schedules, {onDelete: "CASCADE", cascade: true})
    @JoinColumn()
    productionOrder: ProductionOrder

    //REMOVE THIS (Required for testing)
    // @Column()
    // finalGoodId: number
    // @ManyToOne(() => FinalGood)
    // @JoinColumn()
    // finalGood: FinalGood
}
