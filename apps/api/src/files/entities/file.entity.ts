import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { BusinessType } from "../enums/businessType.enum";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
        type: 'enum',
        enum: BusinessType,
        nullable: false,
    })
    businessType: BusinessType

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.documents)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
