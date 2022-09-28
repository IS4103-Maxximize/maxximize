import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionLineItemDto } from './create-production-line-item.dto';

export class UpdateProductionLineItemDto extends PartialType(
  CreateProductionLineItemDto
) {}
