import { IsNotEmpty } from "class-validator";

export class CreateBinDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    volumetricSpace: number;

    @IsNotEmpty()
    rackId: number;
}
