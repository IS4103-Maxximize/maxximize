import { Organisation } from "../../organisations/entities/organisation.entity";
import { Quotation } from "../../quotations/entities/quotation.entity";

export class CreatePurchaseOrderDto {
    deliveryAddress: string;
    totalPrice?: number;
    currentOrganisation: Organisation;
    quotation: Quotation;
}
