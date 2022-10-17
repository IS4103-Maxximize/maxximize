export class CreateVehicleDto {
    description: string;
    isOperating: boolean;
    make: string;
    model: string;
    year: string;
    lastServiced: Date;
    remarks: string;
    organisationId: number;
    licensePlate: string;
    loadCapacity: number;
    location: string;
}
