import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BomLineItem } from "../../bom-line-items/entities/bom-line-item.entity";
import { Product } from "../../products/entities/product.entity";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity()
export class Batch {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    batchNumber: number

    @Column({nullable: false})
    expiryDate: Date

    @Column({nullable: false})
    quantity: number

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.batches)
    warehouse: Warehouse

}
