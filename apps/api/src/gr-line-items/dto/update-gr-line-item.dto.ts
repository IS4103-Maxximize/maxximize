import { PartialType } from '@nestjs/mapped-types';
import { CreateGrLineItemDto } from './create-gr-line-item.dto';

export class UpdateGrLineItemDto extends PartialType(CreateGrLineItemDto) {}
