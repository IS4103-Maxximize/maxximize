import { PartialType } from '@nestjs/mapped-types';
import { Product } from '../../products/entities/product.entity';
import { CreateBomLineItemDto } from './create-bom-line-item.dto';

export class UpdateBomLineItemDto extends PartialType(CreateBomLineItemDto) {
}
