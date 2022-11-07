import { OrganisationType } from "../enums/organisationType.enum";
import { CreateContactDto } from '../../contacts/dto/create-contact.dto'
import { CreateAccountInfoDto } from "../../account-info/dto/create-account-info.dto";

export class CreateOrganisationDto {
  name: string;
  type: OrganisationType;
  uen: string;
  contact?: CreateContactDto
  accountInfo?: CreateAccountInfoDto
}
