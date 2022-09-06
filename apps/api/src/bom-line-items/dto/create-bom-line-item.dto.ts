import { BillOfMaterial } from "../../bill-of-materials/entities/bill-of-material.entity";
import { Product } from "../../products/entities/product.entity";

export class CreateBomLineItemDto{
    subTotal: number;
    product: Product;
    billOfMaterial?: BillOfMaterial;
}
