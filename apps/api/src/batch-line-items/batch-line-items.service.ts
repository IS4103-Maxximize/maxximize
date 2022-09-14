import { Injectable } from '@nestjs/common';
import { CreateBatchLineItemDto } from './dto/create-batch-line-item.dto';
import { UpdateBatchLineItemDto } from './dto/update-batch-line-item.dto';

@Injectable()
export class BatchLineItemsService {
  create(createBatchLineItemDto: CreateBatchLineItemDto) {
    return 'This action adds a new batchLineItem';
  }

  findAll() {
    return `This action returns all batchLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} batchLineItem`;
  }

  update(id: number, updateBatchLineItemDto: UpdateBatchLineItemDto) {
    return `This action updates a #${id} batchLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} batchLineItem`;
  }
}
