import { BusinessType } from "../enums/businessType.enum"

export class UploadFileDto {
    type?: BusinessType
    organisationId?: number
    applicationId?: number
}
