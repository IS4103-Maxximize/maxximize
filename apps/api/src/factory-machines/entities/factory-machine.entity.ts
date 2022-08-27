import { Column, Entity, ManyToMany } from "typeorm";
import { Machine } from "../../machines/machine";
import { OrderProcess } from "../../order-processes/entities/order-process.entity";

@Entity()
export class FactoryMachine extends Machine {
    @Column()
    serialNumber: string;

    @ManyToMany(() => OrderProcess, (orderProcess) => orderProcess.factoryMachines)
    orderProcesses: OrderProcess;
}
