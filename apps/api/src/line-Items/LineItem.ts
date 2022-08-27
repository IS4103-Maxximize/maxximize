import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/entities/product.entity";

export abstract class LineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    subTotal: number

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product
}