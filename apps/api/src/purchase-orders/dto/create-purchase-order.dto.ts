import { CreatePurchaseOrderLineItemDto } from "../../purchase-order-line-items/dto/create-purchase-order-line-item.dto";

export class CreatePurchaseOrderDto {
    deliveryAddress: string;
    totalPrice: number;
    deliveryDate: Date;
    currentOrganisationId: number;
    quotationId: number;
    orgContactId: number;
    userContactId: number;
    supplierContact: number;
    poLineItemDtos: CreatePurchaseOrderLineItemDto[];

}
