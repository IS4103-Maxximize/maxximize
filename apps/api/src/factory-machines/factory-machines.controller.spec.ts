import { Test, TestingModule } from '@nestjs/testing';
import { FactoryMachinesController } from './factory-machines.controller';
import { FactoryMachinesService } from './factory-machines.service';

describe('FactoryMachinesController', () => {
  let controller: FactoryMachinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactoryMachinesController],
      providers: [FactoryMachinesService],
    }).compile();

    controller = module.get<FactoryMachinesController>(FactoryMachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
