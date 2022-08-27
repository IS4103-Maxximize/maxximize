import { Test, TestingModule } from '@nestjs/testing';
import { QualityReviewsService } from './quality-reviews.service';

describe('QualityReviewsService', () => {
  let service: QualityReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualityReviewsService],
    }).compile();

    service = module.get<QualityReviewsService>(QualityReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
