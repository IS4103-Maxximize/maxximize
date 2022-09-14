import { Contact } from "../../contacts/entities/contact.entity";
import { Role } from "../enums/role.enum";
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;
  
  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  organisationId: number;

  @IsNotEmpty()
  contact: Contact;
}
