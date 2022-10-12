import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { FactoryMachine } from "../../factory-machines/entities/factory-machine.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";

@Entity()
export class ProductionLine {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: String

    @Column()
    description: String

    @Column()
    isAvailable: Boolean

    @Column()
    productionCostPerLot: number

    @Column()
    gracePeriod: number

    @Column()
    outputPerHour: number

    @Column()
    startTime: number

    @Column()
    endTime: number

    @Column({nullable: true})
    lastStopped: Date

    @Column()
    created: Date

    @ManyToMany(() => BillOfMaterial, bom => bom.productionLines)
    @JoinTable()
    boms: BillOfMaterial[]

    //schedules
    @OneToMany(() => Schedule, schedule => schedule.productionLine)
    schedules: Schedule[]

    //machines
    @OneToMany(() => FactoryMachine, factoryMachine => factoryMachine.productionLine)
    machines: FactoryMachine[]

    //organisation
    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.productionLines)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
