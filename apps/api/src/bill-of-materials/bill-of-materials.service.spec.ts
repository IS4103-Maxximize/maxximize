import { Test, TestingModule } from '@nestjs/testing';
import { BillOfMaterialsService } from './bill-of-materials.service';

describe('BillOfMaterialsService', () => {
  let service: BillOfMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillOfMaterialsService],
    }).compile();

    service = module.get<BillOfMaterialsService>(BillOfMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
