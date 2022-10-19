import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChronType } from "../enums/chronType.enum";

@Entity()
export class ChronJob {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    scheduledDate: Date

    @Column({
        type: 'enum',
        enum: ChronType
    })
    type: ChronType

    @Column()
    targetId: number
}
