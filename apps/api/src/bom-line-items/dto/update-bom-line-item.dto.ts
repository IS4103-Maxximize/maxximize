import { PartialType } from '@nestjs/mapped-types';
import { CreateBomLineItemDto } from './create-bom-line-item.dto';

export class UpdateBomLineItemDto extends PartialType(CreateBomLineItemDto) {}
