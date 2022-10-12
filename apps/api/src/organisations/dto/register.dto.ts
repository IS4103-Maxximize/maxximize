import { CreateUserDto } from "../../users/dto/create-user.dto";
import { CreateOrganisationDto } from "./create-organisation.dto";

export class RegisterDto {
    createOrganisationDto: CreateOrganisationDto
    createUserDto: CreateUserDto
}