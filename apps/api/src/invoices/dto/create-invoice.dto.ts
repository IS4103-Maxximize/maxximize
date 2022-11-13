import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { InvoiceStatus } from "../enums/invoiceStatus.enum";

@Entity()
export class CreateInvoiceDto {
    amount: number;
    poId: number;
    status: InvoiceStatus
    paymentReceived?: Date
}
