import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";

@Entity()
export class AccountInfo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    bankCode: string

    @Column()
    bankName: string

    @Column()
    accountNumber: string

    @OneToOne(() => Organisation, organisation => organisation.accountInfo)
    @JoinColumn()
    organisation: Organisation
}
