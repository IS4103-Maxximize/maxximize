import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty()
    organisationId: number;
    
    @IsNotEmpty()
    email: string;
}