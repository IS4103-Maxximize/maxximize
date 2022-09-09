import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { PurchaseOrderLineItem } from "../../purchase-order-line-items/entities/purchase-order-line-item.entity";
import { ShellOrganisation } from "../../shell-organisation/entities/shell-organisation.entity";

Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  billingAddress: string;

  @Column()
  totalPrice: number;

  @OneToMany(() => PurchaseOrderLineItem, poLineItem => poLineItem.purchaseOrder)
  poLineItems: PurchaseOrderLineItem[];

  @ManyToOne(() => Contact, contact => contact.purchaseOrders)
  contact: Contact;

  @ManyToOne(() => ShellOrganisation, supplier => supplier.purchaseOrders)
  supplier: ShellOrganisation;

  @ManyToOne(() => Organisation, currentOrganisation => currentOrganisation.purchaseOrders)
  currentOrganisation: Organisation;
}
