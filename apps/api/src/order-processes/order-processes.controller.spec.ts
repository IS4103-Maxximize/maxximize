import { Test, TestingModule } from '@nestjs/testing';
import { OrderProcessesController } from './order-processes.controller';
import { OrderProcessesService } from './order-processes.service';

describe('OrderProcessesController', () => {
  let controller: OrderProcessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderProcessesController],
      providers: [OrderProcessesService],
    }).compile();

    controller = module.get<OrderProcessesController>(OrderProcessesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
