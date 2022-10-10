import { Module } from '@nestjs/common';
import { QualityReviewsService } from './quality-reviews.service';
import { QualityReviewsController } from './quality-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { QualityReview } from './entities/quality-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QualityReview, Order])],
  controllers: [QualityReviewsController],
  providers: [QualityReviewsService]
})
export class QualityReviewsModule {}
