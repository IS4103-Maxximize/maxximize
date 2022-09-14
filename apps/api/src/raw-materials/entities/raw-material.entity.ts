import { Entity, ManyToMany, ManyToOne } from "typeorm";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { Product } from "../../products/entities/product.entity";
import { ShellOrganisation } from "../../shell-organisations/entities/shell-organisation.entity";

@Entity()
export class RawMaterial extends Product {
    @ManyToMany(() => ShellOrganisation, supplier => supplier.rawMaterials)
    suppliers: ShellOrganisation[]

    @ManyToOne(() => Organisation, organisation => organisation.rawMaterials)
    organisation: Organisation
}
