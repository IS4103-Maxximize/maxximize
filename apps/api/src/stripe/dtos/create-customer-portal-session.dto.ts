import { IsNotEmpty } from 'class-validator';

export class CreateCustomerPortalSessionDto {
  @IsNotEmpty()
  customerId: string

  @IsNotEmpty()
  returnUrl: string
}
