import { PartialType } from '@nestjs/mapped-types';
import { CreateBulkDiscountRangeDto } from './create-bulk-discount-range.dto';

export class UpdateBulkDiscountRangeDto extends PartialType(CreateBulkDiscountRangeDto) {}
