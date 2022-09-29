import { PRStatus } from "../enums/prStatus.enum"

export class CreatePurchaseRequisitionDto {
    expectedQuantity: number
    productionOrderId: number
    organisationId: number
    rawMaterialId: number
}
