import { PartialType } from '@nestjs/mapped-types';
import { ProductionOrderStatus } from '../enums/production-order-status.enum';
import { CreateProductionOrderDto } from './create-production-order.dto';

export class UpdateProductionOrderDto extends PartialType(
  CreateProductionOrderDto
) {
	status: ProductionOrderStatus
}
