import { CreateOrganisationDto } from "../../organisations/dto/create-organisation.dto";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateApplicationDto {
    createOrganisationDto: CreateOrganisationDto
    createUserDto: CreateUserDto
}
