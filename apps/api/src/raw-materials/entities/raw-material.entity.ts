import { Entity } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class RawMaterial extends Product {
}
