import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalGoodDto } from './create-final-good.dto';

export class UpdateFinalGoodDto extends PartialType(CreateFinalGoodDto) {}
