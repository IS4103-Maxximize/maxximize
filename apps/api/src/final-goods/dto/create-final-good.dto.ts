import { CreateBillOfMaterialDto } from "../../bill-of-materials/dto/create-bill-of-material.dto";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { CreateProductDto } from "../../products/dto/create-product.dto";
import { FinalGood } from "../entities/final-good.entity";

export class CreateFinalGoodDto extends CreateProductDto{
    lotQuantity: number;
    organisationId: number;
}
