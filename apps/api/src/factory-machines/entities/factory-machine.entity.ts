import { Column, Entity, ManyToMany } from "typeorm";
import { Machine } from "../../vehicles/entities/vehicle.entity";

@Entity()
export class FactoryMachine extends Machine {
    @Column()
    serialNumber: string;
}
