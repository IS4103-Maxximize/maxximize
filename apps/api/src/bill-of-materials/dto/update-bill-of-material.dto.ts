import { PartialType } from '@nestjs/mapped-types';
import { CreateBomLineItemDto } from '../../bom-line-items/dto/create-bom-line-item.dto';
import { CreateBillOfMaterialDto } from './create-bill-of-material.dto';

export class UpdateBillOfMaterialDto extends PartialType(CreateBillOfMaterialDto) {
}
