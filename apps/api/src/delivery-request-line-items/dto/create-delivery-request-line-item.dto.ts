import { Product } from "../../products/entities/product.entity";

export class CreateDeliveryRequestLineItemDto {
    product: Product;
    quantity: number;
}
