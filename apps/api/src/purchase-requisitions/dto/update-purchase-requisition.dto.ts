import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseRequisitionDto } from './create-purchase-requisition.dto';

export class UpdatePurchaseRequisitionDto extends PartialType(CreatePurchaseRequisitionDto) {}
