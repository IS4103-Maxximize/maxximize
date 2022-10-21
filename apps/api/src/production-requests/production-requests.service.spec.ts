import { Test, TestingModule } from '@nestjs/testing';
import { ProductionRequestsService } from './production-requests.service';

describe('ProductionRequestsService', () => {
  let service: ProductionRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionRequestsService],
    }).compile();

    service = module.get<ProductionRequestsService>(ProductionRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
