import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionRequestDto } from './create-production-request.dto';

export class UpdateProductionRequestDto extends PartialType(
  CreateProductionRequestDto
) {}
