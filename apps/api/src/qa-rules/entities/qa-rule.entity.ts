import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { QaChecklist } from "../../qa-checklists/entities/qa-checklist.entity";
import { RuleCategory } from "../enums/ruleCategory.enum";

@Entity()
export class QaRule {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    created: Date

    @Column({
        type: 'enum',
        enum: RuleCategory
    })
    category: RuleCategory

    @Column()
    organisationId: number
    @ManyToOne(() => Organisation, organisation => organisation.qaRules)
    @JoinColumn({name: 'organisationId'})
    organisation: Organisation

    @ManyToMany(() => QaChecklist, qaChecklist => qaChecklist.qaRules)
    qaChecklists: QaChecklist[]
}
