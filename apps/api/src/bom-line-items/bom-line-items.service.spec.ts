import { Test, TestingModule } from '@nestjs/testing';
import { BomLineItemsService } from './bom-line-items.service';

describe('BomLineItemsService', () => {
  let service: BomLineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BomLineItemsService],
    }).compile();

    service = module.get<BomLineItemsService>(BomLineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
