import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from "../../files/entities/file.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { OrganisationType } from "../../organisations/enums/organisationType.enum";
import { Role } from "../../users/enums/role.enum";
import { ApplicationStatus } from "../enums/applicationStatus.enum";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    organisationName: string

    @Column({
        type: 'enum',
        enum: OrganisationType
    })
    organisationType: OrganisationType

    @Column()
    uen: string

    @Column()
    orgPhoneNumber: string

    @Column()
    orgEmail: string

    @Column()
    orgAddress: string

    @Column()
    orgPostalCode: string

    @Column()
    applicantFirstName: string

    @Column()
    applicantLastName: string
    @Column()
    applicantUsername: string
    @Column({
        type: 'enum',
        enum: Role
    })
    role: Role

    @Column()
    applicantPhoneNumber: string

    @Column()
    applicantEmail: string

    @Column()
    applicantAddress: string

    @Column()
    applicantPostalCode: string

    @Column({
        type: 'enum',
        enum: ApplicationStatus
    })
    status: ApplicationStatus

    @OneToMany(() => File, file => file.application)
    documents: File[]

    @Column()
    bankCode: string

    @Column()
    bankName: string

    @Column()
    accountNumber: string

    //organisation here refers to only Maxximize org
    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.applications)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
