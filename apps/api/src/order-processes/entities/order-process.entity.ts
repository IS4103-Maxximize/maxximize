import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { FactoryMachine } from "../../factory-machines/entities/factory-machine.entity";
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

    @ManyToMany(() => FactoryMachine, factoryMachine => factoryMachine.orderProcesses)
    @JoinTable()
    factoryMachines: FactoryMachine[]
    
}
