import { IsEmail } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phoneNumber: string;

    @Column({
        nullable: false,
        unique: true
    })
    @IsEmail()
    email: string;

    @Column()
    address: string;

    @Column()
    postalCode: string

    @OneToOne(() => Organisation, (organisation) => organisation.contact, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    organisation: Organisation | null;

    @OneToOne(() => User, (user) => user.contact)
    user: User | null;

    @OneToOne(() => ShellOrganisation, shellOrganisation => shellOrganisation.contact)
    @JoinColumn()
    shellOrganisation: ShellOrganisation

}
