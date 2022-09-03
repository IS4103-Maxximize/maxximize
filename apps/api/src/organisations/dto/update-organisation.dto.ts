import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganisationDto } from './create-organisation.dto';

export class UpdateOrganisationDto extends PartialType(CreateOrganisationDto) {
  isActive?: string;
  suppliers?: number[]; //array of ids;
  customers?: number[]; //array of ids
}
