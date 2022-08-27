import { PartialType } from '@nestjs/mapped-types';
import { CreateQualityReviewDto } from './create-quality-review.dto';

export class UpdateQualityReviewDto extends PartialType(CreateQualityReviewDto) {}
