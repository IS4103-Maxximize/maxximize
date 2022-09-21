import { IsNotEmpty } from "class-validator";

export class CreateWarehouseDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
    
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    organisationId: number;
}
