import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from "../../batches/entities/batch.entity";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { ProductionLineItem } from "../../production-line-items/entities/production-line-item.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { PurchaseRequisition } from "../../purchase-requisitions/entities/purchase-requisition.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { ProductionOrderStatus } from "../enums/production-order-status.enum";

@Entity()
export class ProductionOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plannedQuantity: number;

    @Column()
    daily: boolean;

    @Column({
        type: 'enum',
        enum: ProductionOrderStatus
    })
    status: ProductionOrderStatus

    @ManyToOne(() => BillOfMaterial, bom => bom.productionOrders, {onDelete:"CASCADE"})
    bom: BillOfMaterial

    @OneToMany(() => Schedule, schedule => schedule.productionOrder)
    schedules: Schedule[]

    @OneToMany(() => ProductionLineItem, prodLineItem => prodLineItem.productionOrder)
    prodLineItems: ProductionLineItem[]

    @OneToOne(() => PurchaseOrder, {nullable:true})
    @JoinColumn()
    purchaseOrder?: PurchaseOrder

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.productionOrders)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
