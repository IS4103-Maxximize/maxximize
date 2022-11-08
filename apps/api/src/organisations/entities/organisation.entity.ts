import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganisationType } from '../enums/organisationType.enum';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Billing } from '../../billings/entities/billing.entity';
import { Machine } from '../../vehicles/entities/vehicle.entity';
import { ShellOrganisation } from '../../shell-organisations/entities/shell-organisation.entity';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { SalesInquiry } from '../../sales-inquiry/entities/sales-inquiry.entity';
import { RawMaterial } from '../../raw-materials/entities/raw-material.entity';
import { FinalGood } from '../../final-goods/entities/final-good.entity';
import { ProductionLine } from '../../production-lines/entities/production-line.entity';
import { QaRule } from '../../qa-rules/entities/qa-rule.entity';
import { QaChecklist } from '../../qa-checklists/entities/qa-checklist.entity';
import { ProductionOrder } from '../../production-orders/entities/production-order.entity';
import { PurchaseRequisition } from '../../purchase-requisitions/entities/purchase-requisition.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { File } from '../../files/entities/file.entity';
import { Application } from '../../applications/entities/application.entity';
import { ProductionRequest } from '../../production-requests/entities/production-request.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { AccountInfo } from '../../account-info/entities/account-info.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { BulkDiscount } from '../../bulk-discounts/entities/bulk-discount.entity';
import { RevenueBracket } from '../../revenue-brackets/entities/revenue-bracket.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: OrganisationType,
    nullable: false,
  })
  type: OrganisationType;

  @Column({ unique: true })
  uen: string;

  @OneToMany(() => User, (user) => user.organisation, {
    cascade: ['remove'],
  })
  users: User[];

  @OneToOne(() => Contact, (contact) => contact.organisation)
  contact: Contact;

  @OneToMany(() => Machine, (machine) => machine.organisation)
  machines: Machine[];

  @OneToMany(() => Order, (order) => order.customer)
  salesOrders: Order[];

  @OneToMany(() => PurchaseOrder, (order) => order.currentOrganisation)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => PurchaseOrder, (order) => order.supplier, {
    nullable: true
  })
  receivedPurchaseOrders: PurchaseOrder[]

  //sent sales salesInquiry
  @OneToMany(
    () => SalesInquiry,
    (salesInquiry) => salesInquiry.currentOrganisation
  )
  salesInquiries: SalesInquiry[];

  //received sales inquiry
  @OneToMany(() => SalesInquiry, salesInquiry => salesInquiry.receivingOrganisation)
  receivedSalesInquiries: SalesInquiry[]

  @OneToMany(() => Warehouse, (warehouse) => warehouse.organisation)
  warehouses: Warehouse[];

  @OneToMany(() => Billing, (billing) => billing.organisation)
  billings: Billing[];

  @OneToMany(
    () => ShellOrganisation,
    (shellOrganisation) => shellOrganisation.parentOrganisation
  )
  shellOrganisations: ShellOrganisation[];

  // @OneToMany(() => ShellOrganisation, shellOrganisation => shellOrganisation.organisation)
  // suppliers: ShellOrganisation[]

  @OneToMany(() => RawMaterial, (rawMaterial) => rawMaterial.organisation)
  rawMaterials: RawMaterial[];

  @OneToMany(() => FinalGood, (finalGood) => finalGood.organisation)
  finalGoods: FinalGood[];

  @OneToMany(() => ProductionLine, productionLine => productionLine.organisation)
  productionLines: ProductionLine[]

  @OneToMany(() => ProductionOrder, productionOrder => productionOrder.organisation)
  productionOrders: ProductionOrder[]

  @OneToMany(() => QaRule, qaRule => qaRule.organisation)
  qaRules: QaRule[]

  @OneToMany(() => QaChecklist, qaChecklist => qaChecklist.organisation)
  qaChecklists: QaChecklist[]

  @OneToMany(() => PurchaseRequisition, purchaseRequisition => purchaseRequisition.organisation)
  purchaseRequisitions: PurchaseRequisition[]

  @OneToMany(() => Quotation, quotation => quotation.receivingOrganisation)
  receivedQuotations: Quotation[]

  @OneToMany(() => Quotation, quotation => quotation.currentOrganisation)
  sentQuotations: Quotation[]

  @OneToMany(() => File, file => file.organisation)
  documents: File[]

  @OneToMany(() => Application, application => application.organisation)
  applications: Application[]

  @OneToMany(() => ProductionRequest, prodRequest => prodRequest.organisation)
  prodRequests: ProductionRequest[]

  @OneToOne(() => Membership, membership => membership.organisation)
  membership: Membership

  @OneToOne(() => AccountInfo, accountInfo => accountInfo.organisation)
  accountInfo: AccountInfo
  @OneToMany(() => Cart, cart => cart.organisation)
  carts: Cart[]

  @OneToMany(() => BulkDiscount, bulkDiscount => bulkDiscount.organisation)
  bulkDiscounts: BulkDiscount[]

  @OneToMany(() => RevenueBracket, revenueBracket => revenueBracket.organisation)
  revenueBrackets: RevenueBracket[]
}
