import { OrganisationType } from "../enums/organisationType.enum";

export class CreateOrganisationDto {
  name: string;
  type: OrganisationType;
}
