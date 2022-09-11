import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

export class CreatePurchaseOrderDto {
    deliveryAddress: string;
    contact?: Contact;
    totalPrice: number;
    createdDateTime?: Date;
    supplierOrganisation: ShellOrganisation;
    currentOrganisation: Organisation;
    poLineItems?: PurchaseOrderLineItem[];
}
