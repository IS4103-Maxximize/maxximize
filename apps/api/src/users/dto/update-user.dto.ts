import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../enums/role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  isActive: string;
  role: Role;
}
