import { Injectable } from '@nestjs/common';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';

@Injectable()
export class ProductionOrdersService {
  create(createProductionOrderDto: CreateProductionOrderDto) {
    return 'This action adds a new productionOrder';
  }

  findAll() {
    return `This action returns all productionOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productionOrder`;
  }

  update(id: number, updateProductionOrderDto: UpdateProductionOrderDto) {
    return `This action updates a #${id} productionOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} productionOrder`;
  }
}
