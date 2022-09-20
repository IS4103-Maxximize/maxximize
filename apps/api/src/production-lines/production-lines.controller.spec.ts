import { Test, TestingModule } from '@nestjs/testing';
import { ProductionLinesController } from './production-lines.controller';
import { ProductionLinesService } from './production-lines.service';

describe('ProductionLinesController', () => {
  let controller: ProductionLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionLinesController],
      providers: [ProductionLinesService],
    }).compile();

    controller = module.get<ProductionLinesController>(ProductionLinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
