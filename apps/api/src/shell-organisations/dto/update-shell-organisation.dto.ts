import { PartialType } from '@nestjs/mapped-types';
import { CreateShellOrganisationDto } from './create-shell-organisation.dto';

export class UpdateShellOrganisationDto extends PartialType(CreateShellOrganisationDto) {
    organisation?: number;
    quotations?: number[];
}
