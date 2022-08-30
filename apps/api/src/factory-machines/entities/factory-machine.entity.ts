import { Column, Entity, ManyToMany } from "typeorm";
import { OrderProcess } from "../../order-processes/entities/order-process.entity";
import { Machine } from "../../vehicles/entities/vehicle.entity";

@Entity()
export class FactoryMachine extends Machine {
    @Column()
    serialNumber: string;

    @ManyToMany(() => OrderProcess, (orderProcess) => orderProcess.factoryMachines)
    orderProcesses: OrderProcess;
}
