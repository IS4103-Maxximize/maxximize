import { Injectable } from '@nestjs/common';
import { CreateGrLineItemDto } from './dto/create-gr-line-item.dto';
import { UpdateGrLineItemDto } from './dto/update-gr-line-item.dto';

@Injectable()
export class GrLineItemsService {
  create(createGrLineItemDto: CreateGrLineItemDto) {
    return 'This action adds a new grLineItem';
  }

  findAll() {
    return `This action returns all grLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grLineItem`;
  }

  update(id: number, updateGrLineItemDto: UpdateGrLineItemDto) {
    return `This action updates a #${id} grLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} grLineItem`;
  }
}
