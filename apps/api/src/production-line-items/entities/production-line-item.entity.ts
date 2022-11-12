import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { ProductionOrder } from "../../production-orders/entities/production-order.entity";
import { PurchaseRequisition } from "../../purchase-requisitions/entities/purchase-requisition.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";
import { ScheduleLineItem } from "../../schedule-line-items/entities/schedule-line-item.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";

@Entity()
export class ProductionLineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number

    @Column({default:true})
    sufficient: boolean

    @DeleteDateColumn()
    deletedDateTime: Date;

    @ManyToOne(() => BatchLineItem, batchLineItem => batchLineItem.productionLineItems, {nullable: true})
    batchLineItem?: BatchLineItem

    @ManyToOne(() => RawMaterial, {nullable: true})
    rawMaterial?: RawMaterial

    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.prodLineItems, {onDelete: "CASCADE", cascade: true})
    productionOrder: ProductionOrder

    @OneToOne(() => PurchaseRequisition, purchaseRequisition => purchaseRequisition.productionLineItem)
    purchaseRequisition: PurchaseRequisition;

    @OneToMany(() => ScheduleLineItem, scheduleLineItem => scheduleLineItem.prodLineItem)
    scheduleLineItems: ScheduleLineItem[]

    // @ManyToMany(() => Schedule, schedule => schedule.prodLineItems)
    // schedules: Schedule[]
}
