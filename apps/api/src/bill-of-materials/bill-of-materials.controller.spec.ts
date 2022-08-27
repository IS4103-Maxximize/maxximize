import { Test, TestingModule } from '@nestjs/testing';
import { BillOfMaterialsController } from './bill-of-materials.controller';
import { BillOfMaterialsService } from './bill-of-materials.service';

describe('BillOfMaterialsController', () => {
  let controller: BillOfMaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillOfMaterialsController],
      providers: [BillOfMaterialsService],
    }).compile();

    controller = module.get<BillOfMaterialsController>(BillOfMaterialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
