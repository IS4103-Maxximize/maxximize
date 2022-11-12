import { RequestByType } from "../enums/RequestByType.enum"

export class CreatePurchaseRequisitionDto {
    expectedQuantity: number
    productionLineItemId?: number
    organisationId: number
    rawMaterialId: number
    requestByType?: RequestByType
    finalGoodId?: number
}
