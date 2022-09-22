import { CreateBomLineItemDto } from "../../bom-line-items/dto/create-bom-line-item.dto";
import { FinalGood } from "../../final-goods/entities/final-good.entity";

export class CreateBillOfMaterialDto {
    finalGoodId: number;
    bomLineItemDtos: CreateBomLineItemDto[];
}
