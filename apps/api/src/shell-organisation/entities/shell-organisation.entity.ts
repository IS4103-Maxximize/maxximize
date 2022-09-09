import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrder } from "../../purchase-order/entities/purchase-order.entity";
import { Quotation } from "../../quotation/entities/quotation.entity";

@Entity()
export class ShellOrganisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organisation, organisation => organisation.shells)
  organisation: Organisation;

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.supplier)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => Quotation, quotation => quotation.shell)
  quotations: Quotation[];
}
