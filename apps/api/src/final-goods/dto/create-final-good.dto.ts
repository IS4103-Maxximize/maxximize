import { CreateProductDto } from "../../products/dto/create-product.dto";

export class CreateFinalGoodDto extends CreateProductDto{
    lotQuantity: number;
    organisationId: number;
    image: string;
}
