import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity()
export class OrderProcess {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productionTime: number

    @OneToOne(() => Order, order => order.orderProcess)
    @JoinColumn()
    order: Order

    @OneToOne(() => BillOfMaterial, billOfMaterial => billOfMaterial.orderProcess)
    billOfMaterial: BillOfMaterial

    @ManyToMany(() => FactoryMachine, factoryMachine => factoryMachine.orderProcesses)
    @JoinTable()
    factoryMachines: FactoryMachine[]
    
}
