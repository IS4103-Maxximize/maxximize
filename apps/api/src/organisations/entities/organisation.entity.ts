import {
  Column,
  Entity,
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

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'true' })
  isActive: string;

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

  @OneToMany(
    () => SalesInquiry,
    (salesInquiry) => salesInquiry.currentOrganisation
  )
  salesInquiries: SalesInquiry[];

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
}
