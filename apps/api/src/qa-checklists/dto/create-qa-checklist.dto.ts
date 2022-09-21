import { ProductType } from "../enums/productType.enum";

export class CreateQaChecklistDto {
    productType: ProductType
    organisationId: number
    qaRuleIds: number[]
}
