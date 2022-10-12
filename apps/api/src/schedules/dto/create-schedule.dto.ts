import { ScheduleType } from "../enums/scheduleType.enum"

export class CreateScheduleDto {
    start: Date
    end: Date
    productionLineId: number
    status: ScheduleType
    //REMOVE THIS (Required for testing)
    //finalGoodId: number
}
