import { CreateContactDto } from "../../contacts/dto/create-contact.dto";
import { OrganisationType } from "../../organisations/enums/organisationType.enum";

export class CreateShellOrganisationDto {
    name: string;
    uen: number;
    type: OrganisationType;
    contact: CreateContactDto;
    organisationId: number
}