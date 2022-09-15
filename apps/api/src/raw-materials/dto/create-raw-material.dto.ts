import { Organisation } from "../../organisations/entities/organisation.entity";
import { CreateProductDto } from "../../products/dto/create-product.dto";

export class CreateRawMaterialDto extends CreateProductDto{
    organisation: Organisation;
}
