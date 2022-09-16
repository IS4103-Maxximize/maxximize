import { ChildEntity, Column, Entity, OneToOne, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BillOfMaterial } from '../../bill-of-materials/entities/bill-of-material.entity';
import { Organisation } from '../../organisations/entities/organisation.entity';

@ChildEntity()
export class FinalGood extends Product {
  @Column()
  lotQuantity: number;

  @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.finalGood)
  billOfMaterial: BillOfMaterial;
}
