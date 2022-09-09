import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { ShellOrganisation } from "../../shell-organisation/entities/shell-organisation.entity";

Entity()
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShellOrganisation, shell => shell.quotations)
  shell: ShellOrganisation;

  @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.quotation)
  poLineItems: PurchaseOrderLineItem[];
}
