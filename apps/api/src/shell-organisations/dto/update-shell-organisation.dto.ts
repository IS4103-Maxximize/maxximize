import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from '../../contacts/dto/create-contact.dto';
import { Organisation } from '../../organisations/entities/organisation.entity';
import { OrganisationType } from '../../organisations/enums/organisationType.enum';
import { RawMaterial } from '../../raw-materials/entities/raw-material.entity';
import { CreateShellOrganisationDto } from './create-shell-organisation.dto';

export class UpdateShellOrganisationDto extends PartialType(CreateShellOrganisationDto) {
    name?: string
    type?: OrganisationType;
    contact?: CreateContactDto;
    rawMaterials?: number[];
}
