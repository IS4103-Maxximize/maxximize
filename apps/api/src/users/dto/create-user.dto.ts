import { CreateContactDto } from "../../contacts/dto/create-contact.dto";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
  organisationId: number;
  contact?: CreateContactDto;
}
