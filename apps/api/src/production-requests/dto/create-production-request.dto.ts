import { ProdRequestStatus } from "../enums/prodRequestStatus.enum";

export class CreateProductionRequestDto {
    quantity: number;
    finalGoodId: number;
    status?: ProdRequestStatus;
    purchaseOrderId?: number;
    organisationId: number;
}
