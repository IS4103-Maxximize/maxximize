import { Injectable } from '@nestjs/common';
import { CreateBomLineItemDto } from './dto/create-bom-line-item.dto';
import { UpdateBomLineItemDto } from './dto/update-bom-line-item.dto';

@Injectable()
export class BomLineItemsService {
  create(createBomLineItemDto: CreateBomLineItemDto) {
    return 'This action adds a new bomLineItem';
  }

  findAll() {
    return `This action returns all bomLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bomLineItem`;
  }

  update(id: number, updateBomLineItemDto: UpdateBomLineItemDto) {
    return `This action updates a #${id} bomLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} bomLineItem`;
  }
}
