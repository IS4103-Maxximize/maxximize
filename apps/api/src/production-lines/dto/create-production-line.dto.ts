export class CreateProductionLineDto {
    name: string
    description: string
    finalGoodId: number
    productionCostPerLot: number
    gracePeriod: number
    organisationId: number
    outputPerHour: number
    startTime: number
    endTime: number
}
