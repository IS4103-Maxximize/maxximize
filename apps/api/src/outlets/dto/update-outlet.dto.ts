import { PartialType } from '@nestjs/mapped-types';
import { CreateOutletDto } from './create-outlet.dto';

export class UpdateOutletDto extends PartialType(CreateOutletDto) {}
