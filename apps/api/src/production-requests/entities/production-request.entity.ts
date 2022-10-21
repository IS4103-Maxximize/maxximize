import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { ProdRequestStatus } from "../enums/prodRequestStatus.enum";

@Entity()
export class ProductionRequest {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column({
        type: 'enum',
        enum: ProdRequestStatus
    })
    status: ProdRequestStatus

    @Column()
    createdDateTime: Date;

    @OneToOne(() => ProductionOrder, prodOrder => prodOrder.prodRequest ,{nullable:true})
    prodOrder?: ProductionOrder

    @ManyToOne(() => FinalGood)
    finalGood: FinalGood

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.prodRequests, {nullable:true})
    purchaseOrder?: PurchaseOrder

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.prodRequests)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
