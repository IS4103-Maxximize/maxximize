import { Injectable } from '@nestjs/common';
import { CreateOrderProcessDto } from './dto/create-order-process.dto';
import { UpdateOrderProcessDto } from './dto/update-order-process.dto';

@Injectable()
export class OrderProcessesService {
  create(createOrderProcessDto: CreateOrderProcessDto) {
    return 'This action adds a new orderProcess';
  }

  findAll() {
    return `This action returns all orderProcesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderProcess`;
  }

  update(id: number, updateOrderProcessDto: UpdateOrderProcessDto) {
    return `This action updates a #${id} orderProcess`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderProcess`;
  }
}
