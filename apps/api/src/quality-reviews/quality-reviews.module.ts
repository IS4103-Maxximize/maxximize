import { Module } from '@nestjs/common';
import { QualityReviewsService } from './quality-reviews.service';
import { QualityReviewsController } from './quality-reviews.controller';

@Module({
  controllers: [QualityReviewsController],
  providers: [QualityReviewsService]
})
export class QualityReviewsModule {}
