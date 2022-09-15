import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateContactDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  postalCode: string
}
