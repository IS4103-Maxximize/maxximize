import { PartialType } from '@nestjs/mapped-types';
import { CreateQaRuleDto } from './create-qa-rule.dto';

export class UpdateQaRuleDto extends PartialType(CreateQaRuleDto) {}
