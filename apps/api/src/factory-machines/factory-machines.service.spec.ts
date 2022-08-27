import { Test, TestingModule } from '@nestjs/testing';
import { FactoryMachinesService } from './factory-machines.service';

describe('FactoryMachinesService', () => {
  let service: FactoryMachinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactoryMachinesService],
    }).compile();

    service = module.get<FactoryMachinesService>(FactoryMachinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
