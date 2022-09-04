import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BomLineItem } from "../../bom-line-items/entities/bom-line-item.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { OrderProcess } from "../../order-processes/entities/order-process.entity";

@Entity()
export class BillOfMaterial {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    totalCost: number

    @Column()
    totalQuantity: number

    @OneToOne(() => OrderProcess, orderProcess => orderProcess.billOfMaterial)
    @JoinColumn()
    orderProcess: OrderProcess

    @OneToOne(() => FinalGood, finalGood => finalGood.billOfMaterial)
    finalGood: FinalGood

    @OneToMany(() => BomLineItem, bomLineItem => bomLineItem.billOfMaterial)
    bomLineItems: BomLineItem[]
}
