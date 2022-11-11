import { ChildEntity, OneToMany, OneToOne } from 'typeorm';
import { BillOfMaterial } from '../../bill-of-materials/entities/bill-of-material.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductionLine } from '../../production-lines/entities/production-line.entity';
import { CartLineItem } from '../../cart-line-items/entities/cart-line-item.entity';
import { File } from '../../files/entities/file.entity';

@ChildEntity()
export class FinalGood extends Product {
  @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.finalGood)
  billOfMaterial: BillOfMaterial;

  @OneToMany(() => CartLineItem, cartLineItem => cartLineItem.finalGood)
  cartLineItems: CartLineItem[]

  @OneToOne(() => File, file => file.finalGood)
  image: File

}
