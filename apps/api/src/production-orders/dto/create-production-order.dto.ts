import { ProductionOrderStatus } from "../enums/production-order-status.enum";

export class CreateProductionOrderDto {
    plannedQuantity: number;
    bomId: number;
    status: ProductionOrderStatus;
    daily: boolean;
    organisationId: number;
    duration?: number;
    purchaseOrderId?: number;
}
