import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phoneNumber: number;

    @Column()
    email: string;

    @Column()
    address: string;

    @OneToOne(() => Organisation, (organisation) => organisation.contact, {
        onDelete: 'CASCADE'
    })
    organisation: Organisation;

    @OneToOne(() => User, (user) => user.contact, {
        onDelete: 'CASCADE'
    })
    user: User;
}
