import { PartialType } from '@nestjs/mapped-types';
import { CreateBillOfMaterialDto } from './create-bill-of-material.dto';

export class UpdateBillOfMaterialDto extends PartialType(CreateBillOfMaterialDto) {}
