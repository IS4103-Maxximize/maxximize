import { BusinessType } from "../enums/businessType.enum"

export class CreateFileDto {
    name: string
    type: BusinessType
    organisationId: number
}
