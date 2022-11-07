import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CreateInvoiceDto {
    amount: number;
    poId: number;
}
