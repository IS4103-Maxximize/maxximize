import { PartialType } from '@nestjs/mapped-types';
import { CreateBulkDiscountDto } from './create-bulk-discount.dto';

export class UpdateBulkDiscountDto extends PartialType(CreateBulkDiscountDto) {
    isActive?: boolean
}
