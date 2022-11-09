import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";

@Entity()
export class Outlet {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string

    @Column()
    name: string

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.outlets)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
