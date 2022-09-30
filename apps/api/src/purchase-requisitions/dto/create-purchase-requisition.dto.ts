import { PRStatus } from "../enums/prStatus.enum"

export class CreatePurchaseRequisitionDto {
    expectedQuantity: number
    productionLineItemId: number
    organisationId: number
    rawMaterialId: number
}
