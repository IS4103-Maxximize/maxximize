import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountInfoDto } from './create-account-info.dto';

export class UpdateAccountInfoDto extends PartialType(CreateAccountInfoDto) {}
