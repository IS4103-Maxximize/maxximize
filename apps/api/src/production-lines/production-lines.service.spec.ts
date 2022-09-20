import { Test, TestingModule } from '@nestjs/testing';
import { ProductionLinesService } from './production-lines.service';

describe('ProductionLinesService', () => {
  let service: ProductionLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionLinesService],
    }).compile();

    service = module.get<ProductionLinesService>(ProductionLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
