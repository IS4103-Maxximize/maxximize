import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';

describe('PurchaseRequisitionsService', () => {
  let service: PurchaseRequisitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseRequisitionsService],
    }).compile();

    service = module.get<PurchaseRequisitionsService>(PurchaseRequisitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
