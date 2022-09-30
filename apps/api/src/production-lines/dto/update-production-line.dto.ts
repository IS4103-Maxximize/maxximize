import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionLineDto } from './create-production-line.dto';

export class UpdateProductionLineDto extends PartialType(CreateProductionLineDto) {
    isAvailable?: Boolean
    lastStopped?: Date
}
