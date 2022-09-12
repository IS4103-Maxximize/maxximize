import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchLineItemDto } from './create-batch-line-item.dto';

export class UpdateBatchLineItemDto extends PartialType(CreateBatchLineItemDto) {}
