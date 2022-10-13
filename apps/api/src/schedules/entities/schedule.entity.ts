import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { Batch } from "../../batches/entities/batch.entity";
import { ProductionLineItem } from "../../production-line-items/entities/production-line-item.entity";
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

    @OneToOne(() => Batch, completedGood => completedGood.schedule)
    @JoinColumn()
    completedGoods: Batch

    @ManyToMany(() => ProductionLineItem, prodLineItem => prodLineItem.schedules)
    @JoinTable()
    prodLineItems: ProductionLineItem[]
    //REMOVE THIS (Required for testing)
    // @Column()
    // finalGoodId: number
    // @ManyToOne(() => FinalGood)
    // @JoinColumn()
    // finalGood: FinalGood
}
