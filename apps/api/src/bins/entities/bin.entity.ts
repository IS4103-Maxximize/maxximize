import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity()
export class Bin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @ManyToOne(() => Warehouse, warehouse => warehouse.bins)
    warehouse: Warehouse
}
