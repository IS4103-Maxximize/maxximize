import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from '../../contacts/dto/create-contact.dto';
import { CreateOrganisationDto } from './create-organisation.dto';

export class UpdateOrganisationDto extends PartialType(CreateOrganisationDto) {
  isActive?: boolean;
  suppliers?: number[]; //array of supplier ids
  customers?: number[]; //array of customer ids
  contact?: CreateContactDto
}
