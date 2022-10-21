import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
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

    @Column({unique: true})
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: "true"
    })
    isActive: string;

    @Column()
    @Exclude()
    salt: string;

    @Column({
        default: false
    })
    passwordChanged: boolean;

    @Column({
        default: true
    })
    available: boolean;

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
        cascade: true
    })
    @JoinColumn()
    contact: Contact;

    @OneToMany(() => DeliveryRequest, (deliveryRequest) => deliveryRequest.user)
    deliveryRequests: DeliveryRequest;
}
