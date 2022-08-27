import { Column, Entity, ManyToMany } from "typeorm";
import { Machine } from "../../machines/machine";

@Entity()
export class FactoryMachine extends Machine {
    @Column()
    serialNumber: string;

    @ManyToMany(() => OrderProcess, (orderProcess) => orderProcess.factoryMachines)
    orderProcesses: OrderProcess;
}
