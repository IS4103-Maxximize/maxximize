import { ChildEntity, ManyToMany, OneToMany } from 'typeorm';
import { BomLineItem } from '../../bom-line-items/entities/bom-line-item.entity';
import { Product } from '../../products/entities/product.entity';
import { ShellOrganisation } from '../../shell-organisations/entities/shell-organisation.entity';

@ChildEntity()
export class RawMaterial extends Product {
  @ManyToMany(() => ShellOrganisation, (supplier) => supplier.rawMaterials)
  suppliers: ShellOrganisation[];

  @OneToMany(() => BomLineItem, (bomLineItems) => bomLineItems.rawMaterial)
  bomLineItems: BomLineItem[];
}
