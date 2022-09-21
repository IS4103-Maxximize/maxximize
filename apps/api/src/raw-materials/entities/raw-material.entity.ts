import { ChildEntity, ManyToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ShellOrganisation } from '../../shell-organisations/entities/shell-organisation.entity';

@ChildEntity()
export class RawMaterial extends Product {
  @ManyToMany(() => ShellOrganisation, (supplier) => supplier.rawMaterials)
  suppliers: ShellOrganisation[];
}
