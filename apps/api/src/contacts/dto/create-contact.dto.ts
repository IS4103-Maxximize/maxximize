import { User } from "../../users/entities/user.entity";

export class CreateContactDto {
  phoneNumber: string;
  email: string;
  address: string;
  postalCode: string
  user: User;
}
