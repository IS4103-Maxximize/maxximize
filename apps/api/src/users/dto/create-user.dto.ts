import { Role } from '../enums/role.enum';
import { IsNotEmpty } from 'class-validator';
import { CreateContactDto } from '../../contacts/dto/create-contact.dto';

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
  contact: CreateContactDto;
}
