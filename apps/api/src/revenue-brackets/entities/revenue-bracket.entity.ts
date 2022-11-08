import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";

@Entity()
export class RevenueBracket {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    start: number

    @Column({nullable: true})
    end: number

    @Column()
    commisionRate: number

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organsation => organsation.revenueBrackets)
    organisation: Organisation
}
