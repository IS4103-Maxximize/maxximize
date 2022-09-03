import { OrganisationType } from "../enums/organisationType.enum";
import { CreateContactDto } from '../../contacts/dto/create-contact.dto'

export class CreateOrganisationDto {
  name: string;
  type: OrganisationType;
  contact?: CreateContactDto
}
