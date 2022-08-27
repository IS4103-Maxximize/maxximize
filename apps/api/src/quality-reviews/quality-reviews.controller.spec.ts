import { Test, TestingModule } from '@nestjs/testing';
import { QualityReviewsController } from './quality-reviews.controller';
import { QualityReviewsService } from './quality-reviews.service';

describe('QualityReviewsController', () => {
  let controller: QualityReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualityReviewsController],
      providers: [QualityReviewsService],
    }).compile();

    controller = module.get<QualityReviewsController>(QualityReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
