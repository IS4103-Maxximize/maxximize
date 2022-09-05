import { Contact } from "../../contacts/entities/contact.entity";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
  organisationId: number;
  contact: Contact;
}
