import { PartialType } from '@nestjs/mapped-types';
import { CreateChronJobDto } from './create-chron-job.dto';

export class UpdateChronJobDto extends PartialType(CreateChronJobDto) {}
