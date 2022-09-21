import { IsNotEmpty } from "class-validator";

export class CreateBinDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    capacity: number;

    @IsNotEmpty()
    warehouseId: number;
}
