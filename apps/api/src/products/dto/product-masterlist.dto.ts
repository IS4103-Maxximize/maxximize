import { BatchLineItem } from "../../batch-line-items/entities/batch-line-item.entity";
import { Product } from "../entities/product.entity";

export class ProductMasterList {
    product: Product;
    totalQuantity: number;
    reservedQuantity: number;
    batchLineItems: BatchLineItem[]
}