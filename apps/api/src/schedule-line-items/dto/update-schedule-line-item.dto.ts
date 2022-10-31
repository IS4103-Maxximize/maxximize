import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleLineItemDto } from './create-schedule-line-item.dto';

export class UpdateScheduleLineItemDto extends PartialType(
  CreateScheduleLineItemDto
) {}
