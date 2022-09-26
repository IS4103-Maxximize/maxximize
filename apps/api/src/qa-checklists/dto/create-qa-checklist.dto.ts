import { ProductType } from "../enums/productType.enum";

export class CreateQaChecklistDto {
    name: string
    productType: ProductType
    organisationId: number
    qaRuleIds: number[]
}
