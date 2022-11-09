import { PartialType } from '@nestjs/mapped-types';
import { CreateRevenueBracketDto } from './create-revenue-bracket.dto';

export class UpdateRevenueBracketDto extends PartialType(CreateRevenueBracketDto) {}
