import { ChronType } from "../enums/chronType.enum"

export class CreateChronJobDto {
    scheduledDate: Date
    type: ChronType
    targetId: number
}
