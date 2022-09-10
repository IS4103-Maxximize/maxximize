import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

@Entity()
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    lotQuantity: number

    @Column()
    lotPrice: number

    @ManyToOne(() => Organisation)
    shellOrganisation: ShellOrganisation
}
