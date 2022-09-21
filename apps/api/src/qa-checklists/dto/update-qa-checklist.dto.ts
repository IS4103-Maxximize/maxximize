import { PartialType } from '@nestjs/mapped-types';
import { CreateQaChecklistDto } from './create-qa-checklist.dto';

export class UpdateQaChecklistDto extends PartialType(CreateQaChecklistDto) {}
