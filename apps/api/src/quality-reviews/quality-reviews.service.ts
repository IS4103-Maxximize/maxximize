import { Injectable } from '@nestjs/common';
import { CreateQualityReviewDto } from './dto/create-quality-review.dto';
import { UpdateQualityReviewDto } from './dto/update-quality-review.dto';

@Injectable()
export class QualityReviewsService {
  create(createQualityReviewDto: CreateQualityReviewDto) {
    return 'This action adds a new qualityReview';
  }

  findAll() {
    return `This action returns all qualityReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qualityReview`;
  }

  update(id: number, updateQualityReviewDto: UpdateQualityReviewDto) {
    return `This action updates a #${id} qualityReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} qualityReview`;
  }
}
