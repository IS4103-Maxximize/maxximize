import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/entities/product.entity";

export abstract class LineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    subTotal: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;
}