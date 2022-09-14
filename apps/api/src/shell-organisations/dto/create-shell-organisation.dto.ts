import { CreateContactDto } from "../../contacts/dto/create-contact.dto";
import { Organisation } from "../../organisations/entities/organisation.entity";
import { OrganisationType } from "../../organisations/enums/organisationType.enum";

export class CreateShellOrganisationDto {
    name: string;
    uen: string;
    type: OrganisationType;
    contact?: CreateContactDto;
    creator: Organisation;
}
