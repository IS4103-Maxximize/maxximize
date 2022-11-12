import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "../../applications/entities/application.entity";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
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

    @Column({nullable: true})
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.documents)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation

    @Column({nullable: true})
    applicationId: number
    @ManyToOne(() => Application, application => application.documents)
    application: Application

    @OneToOne(() => FinalGood, finalGood => finalGood.image)
    @JoinColumn()
    finalGood: FinalGood


}
