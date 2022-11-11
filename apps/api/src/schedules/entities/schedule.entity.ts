import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { Batch } from "../../batches/entities/batch.entity";
import { ProductionLineItem } from "../../production-line-items/entities/production-line-item.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { ProductionLine } from "../../production-lines/entities/production-line.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { ScheduleType } from "../enums/scheduleType.enum";
import { ScheduleLineItem } from "../../schedule-line-items/entities/schedule-line-item.entity";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column({nullable: true})
    actualQuantity: number;

    @Column({nullable: true})
    expectedQuantity: number;

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

    @OneToOne(() => Batch, completedGood => completedGood.schedule)
    @JoinColumn()
    completedGoods: Batch

    @OneToMany(() => ScheduleLineItem, scheduleLineItem => scheduleLineItem.schedule)
    scheduleLineItems: ScheduleLineItem[]

    // @ManyToMany(() => ProductionLineItem)
    // @JoinTable()
    // prodLineItems: ProductionLineItem[]
    
    //REMOVE THIS (Required for testing)
    // @Column()
    // finalGoodId: number
    // @ManyToOne(() => FinalGood)
    // @JoinColumn()
    // finalGood: FinalGood
}
