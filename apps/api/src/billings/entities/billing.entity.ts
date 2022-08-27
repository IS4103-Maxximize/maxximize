import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Billing {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    billingDate: Date

    @Column()
    amount: number

    @Column()
    billingAddress: string

    @ManyToOne(() => Organisation, organisation => organisation.billings)
    organisation: Organisation
}
