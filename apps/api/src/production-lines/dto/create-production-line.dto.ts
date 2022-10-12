import { Machine } from "../../vehicles/entities/vehicle.entity"

export class CreateProductionLineDto {
    name: string
    description: string
    bomIds: number[]
    productionCostPerLot: number
    gracePeriod: number
    organisationId: number
    outputPerHour: number
    startTime: number
    endTime: number
    machineIds: number[]
}
