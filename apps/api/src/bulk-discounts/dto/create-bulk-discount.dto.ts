import { CreateBulkDiscountRangeDto } from "../../bulk-discount-ranges/dto/create-bulk-discount-range.dto";
import { BulkDiscountRange } from "../../bulk-discount-ranges/entities/bulk-discount-range.entity";
import { BulkType } from "../enums/bulkType.enum";

export class CreateBulkDiscountDto {
    bulkType: BulkType
    bulkDiscountRangeDtos: CreateBulkDiscountRangeDto[]
    organisationId: number
    scheduleActivation?: Date
}
