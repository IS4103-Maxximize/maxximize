import { Injectable } from '@nestjs/common';
import { CreateProductionLineItemDto } from './dto/create-production-line-item.dto';
import { UpdateProductionLineItemDto } from './dto/update-production-line-item.dto';

@Injectable()
export class ProductionLineItemsService {
  create(createProductionLineItemDto: CreateProductionLineItemDto) {
    return 'This action adds a new productionLineItem';
  }

  findAll() {
    return `This action returns all productionLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productionLineItem`;
  }

  update(id: number, updateProductionLineItemDto: UpdateProductionLineItemDto) {
    return `This action updates a #${id} productionLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} productionLineItem`;
  }
}
