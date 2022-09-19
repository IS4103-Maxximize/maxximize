import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";

@Entity()
export class ProductionLine {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: String

    @Column()
    description: String

    @Column()
    isAvailable: Boolean

    @Column()
    productionCostPerLot: number

    @Column()
    changeOverTime: number

    @Column()
    nextAvailableDateTime: Date

    @Column({nullable: true})
    lastStopped: Date

    @Column()
    created: Date

    @Column()
    finalGoodId: number
    @ManyToOne(() => FinalGood, finalGood => finalGood.productionLines)
    @JoinColumn()
    finalGood: FinalGood

    //schedules
    @OneToMany(() => Schedule, schedule => schedule.productionLine)
    schedules: Schedule[]

    //machines
}
