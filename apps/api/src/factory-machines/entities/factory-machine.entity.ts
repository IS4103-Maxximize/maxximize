import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { ProductionLine } from "../../production-lines/entities/production-line.entity";
import { Machine } from "../../vehicles/entities/vehicle.entity";

@Entity()
export class FactoryMachine extends Machine {
    @Column()
    serialNumber: string;

    @Column({nullable: true})
    productionLineId: number
    @ManyToOne(() => ProductionLine, productionLine => productionLine.machines, {onDelete: "SET NULL"})
    @JoinColumn({name: 'productionLineId'})
    productionLine: ProductionLine
}
