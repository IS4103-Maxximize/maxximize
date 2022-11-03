import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { SubscriptionPlan } from "../enums/subscription-plan.enum";

@Entity()
export class Membership {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: SubscriptionPlan,
        nullable: true
    })
    plan: SubscriptionPlan

    @Column({nullable: true})
    planAmount: number

    @Column({nullable: true})
    cancelAt: Date

    @Column({nullable: true})
    currentPeriodStart: Date

    @Column({nullable: true})
    currentPeriodEnd: Date

    @Column({nullable: true})
    daysUntilDue: number

    @Column({default: false})
    isActive: boolean

    @Column({nullable: true})
    subscriptionId: string

    @Column({nullable: true})
    customerId: string
    
    @OneToOne(() => Organisation, organisation => organisation.membership)
    @JoinColumn()
    organisation: Organisation



}
