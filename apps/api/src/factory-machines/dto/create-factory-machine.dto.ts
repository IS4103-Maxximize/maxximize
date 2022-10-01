export class CreateFactoryMachineDto {
    serialNumber: string
    description: string
    isOperating: boolean
    make: string
    model: string
    year: string
    lastServiced: Date
    remarks: string
    organisationId: number
}
