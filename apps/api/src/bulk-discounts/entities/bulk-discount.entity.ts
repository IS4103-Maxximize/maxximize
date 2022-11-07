import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BulkDiscountRange } from "../../bulk-discount-ranges/entities/bulk-discount-range.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { BulkType } from "../enums/bulkType.enum";

@Entity()
export class BulkDiscount {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: BulkType,
        default: BulkType.WEIGHT
    })
    bulkType: BulkType

    @Column({default: false})
    isActive: boolean

    @Column()
    created: Date

    @Column({nullable: true})
    scheduleActivation: Date

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.bulkDiscounts)
    @JoinColumn()
    organisation: Organisation

    @OneToMany(() => BulkDiscountRange, bulkDiscountRange => bulkDiscountRange.bulkDiscount)
    bulkDiscountRanges: BulkDiscountRange[]

}
