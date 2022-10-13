import { CreateSalesInquiryLineItemDto } from "../../sales-inquiry-line-items/dto/create-sales-inquiry-line-item.dto";

export class CreateSalesInquiryDto {
    currentOrganisationId: number;
    totalPrice: number;
    salesInquiryLineItemsDtos: CreateSalesInquiryLineItemDto[];
    purchaseRequisitionIds?: number[];
    receivingOrganisationId?: number
    expiryDuration?: number
}
