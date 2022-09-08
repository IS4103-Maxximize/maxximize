import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Role } from "../enums/role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({default: "true"})
    isActive: string;

    @Column()
    @Exclude()
    salt: string;

    @Column({
        type: 'enum',
        enum: Role
    })
    role: Role;

    @ManyToOne(() => Organisation, (organisation) => organisation.users, {
        onDelete: 'CASCADE',
    })
    organisation: Organisation;

    @OneToOne(() => Contact, (contact) => contact.user, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    contact: Contact;
}
