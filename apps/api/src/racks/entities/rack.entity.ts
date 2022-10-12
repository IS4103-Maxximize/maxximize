import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bin } from "../../bins/entities/bin.entity";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity()
export class Rack {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Warehouse, warehouse => warehouse.racks)
    warehouse: Warehouse;

    @OneToMany(() => Bin, bin => bin.rack)
    bins: Bin[];
}
