import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BulkDiscount } from "../../bulk-discounts/entities/bulk-discount.entity";

@Entity()
export class BulkDiscountRange {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    bulkDiscountId: number
    @ManyToOne(() => BulkDiscount, bulkDiscount => bulkDiscount.bulkDiscountRanges, {onDelete: "CASCADE"})
    @JoinColumn()
    bulkDiscount: BulkDiscount

    @Column()
    start: number

    @Column()
    end: number

    @Column()
    discountRate: number
}
