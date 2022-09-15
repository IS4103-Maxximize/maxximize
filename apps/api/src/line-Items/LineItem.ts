import { Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/entities/product.entity";

export abstract class LineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subTotal: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;
}