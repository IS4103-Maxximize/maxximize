import { ChildEntity, Entity } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@ChildEntity()
export class RawMaterial extends Product {
}
