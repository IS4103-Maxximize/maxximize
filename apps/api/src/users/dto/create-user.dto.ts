import { Organisation } from "../../organisations/entities/organisation.entity";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
  organisation: Organisation;
}
