import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Organisation } from "../../organisations/entities/organisation.entity"
import { ProductionOrder } from "../../production-orders/entities/production-order.entity"
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity"
import { SalesInquiry } from "../../sales-inquiry/entities/sales-inquiry.entity"
import { PRStatus } from "../enums/prStatus.enum"

@Entity()
export class PurchaseRequisition {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    expectedQuantity: number

    @Column()
    quantityToFulfill: number

    @Column({
        type: 'enum',
        enum: PRStatus
    })
    status: PRStatus

    @Column()
    rawMaterialId: number
    @ManyToOne(() => RawMaterial)
    @JoinColumn({name: 'rawMaterialId'})
    rawMaterial: RawMaterial

    @Column()
    productionOrderId: number
    @ManyToOne(() => ProductionOrder, productionOrder => productionOrder.purchaseRequisitions)
    @JoinColumn({name: 'productionOrderId'})
    productionOrder: ProductionOrder

    @Column({nullable: true})
    salesInquiryId: number
    @ManyToOne(() => SalesInquiry, salesInquiry => salesInquiry.purchaseRequisitions)
    @JoinColumn({name: 'salesInquiryId'})
    salesInquiry: SalesInquiry

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.purchaseRequisitions)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation

}