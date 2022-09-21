import { RuleCategory } from "../enums/ruleCategory.enum"

export class CreateQaRuleDto {
    title: string
    description: string
    category: RuleCategory
    organisationId: number
}
