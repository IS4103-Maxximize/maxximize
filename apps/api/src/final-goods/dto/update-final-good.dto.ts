import { PartialType } from '@nestjs/mapped-types';
import { UpdateProductDto } from '../../products/dto/update-product.dto';
import { CreateFinalGoodDto } from './create-final-good.dto';

export class UpdateFinalGoodDto extends PartialType(CreateFinalGoodDto) {
    description?: string;
    unitPrice?: number;
    expiry?: number;
}
