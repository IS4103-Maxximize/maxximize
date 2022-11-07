import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../carts/entities/cart.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";

@Entity()
export class CartLineItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column({nullable: true})
    cartId: number
    @ManyToOne(() => Cart, cart => cart.cartLineItems, {onDelete: 'CASCADE'})
    @JoinColumn()
    cart: Cart

    @ManyToOne(() => FinalGood, finalGood => finalGood.cartLineItems)
    @JoinColumn()
    finalGood: FinalGood
    
}
