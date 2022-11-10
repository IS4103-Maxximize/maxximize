import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartLineItem } from "../../cart-line-items/entities/cart-line-item.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({default: 0})
    totalPrice: number

    @Column({default: 0})
    totalWeight: number

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.carts)
    organisation: Organisation

    @Column()
    supplierId: number
    @ManyToOne(() => Organisation, organisation => organisation.placeholderCarts)
    @JoinColumn({name: 'supplierId'})
    supplier: Organisation

    @OneToMany(() => CartLineItem, cartLineItem => cartLineItem.cart)
    cartLineItems: CartLineItem[]
    
    
}
