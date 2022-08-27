import { Test, TestingModule } from '@nestjs/testing';
import { OrderProcessesService } from './order-processes.service';

describe('OrderProcessesService', () => {
  let service: OrderProcessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProcessesService],
    }).compile();

    service = module.get<OrderProcessesService>(OrderProcessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
