import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export abstract class LineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    subTotal: number

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product
}