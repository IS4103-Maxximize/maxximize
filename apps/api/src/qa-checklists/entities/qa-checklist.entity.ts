import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { QaRule } from "../../qa-rules/entities/qa-rule.entity";
import { ProductType } from "../enums/productType.enum";

@Entity()
export class QaChecklist {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: ProductType
    })
    productType: ProductType

    @ManyToMany(() => QaRule, qaRule => qaRule.qaChecklists)
    @JoinTable()
    qaRules: QaRule[]

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.qaChecklists)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation
}
