import { PartialType } from '@nestjs/mapped-types';
import { CreateBinDto } from './create-bin.dto';

export class UpdateBinDto extends PartialType(CreateBinDto) {}
