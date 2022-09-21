import { ChildEntity, OneToOne } from 'typeorm';
import { BillOfMaterial } from '../../bill-of-materials/entities/bill-of-material.entity';
import { Product } from '../../products/entities/product.entity';

@ChildEntity()
export class FinalGood extends Product {
  @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.finalGood)
  billOfMaterial: BillOfMaterial;
}
