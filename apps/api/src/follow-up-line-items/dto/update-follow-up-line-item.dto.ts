import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowUpLineItemDto } from './create-follow-up-line-item.dto';

export class UpdateFollowUpLineItemDto extends PartialType(
  CreateFollowUpLineItemDto
) {}
