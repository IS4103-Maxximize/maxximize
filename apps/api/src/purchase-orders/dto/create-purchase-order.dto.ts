import { CreatePurchaseOrderLineItemDto } from "../../purchase-order-line-items/dto/create-purchase-order-line-item.dto";

export class CreatePurchaseOrderDto {
    deliveryAddress: string;
    totalPrice: number;
    deliveryDate: Date;
    currentOrganisationId: number;
    quotationId: number;
    userContactId: number;
    date?: Date;
    poLineItemDtos: CreatePurchaseOrderLineItemDto[];
}
