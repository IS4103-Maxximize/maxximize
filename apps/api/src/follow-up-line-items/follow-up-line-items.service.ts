import { Injectable } from '@nestjs/common';
import { CreateFollowUpLineItemDto } from './dto/create-follow-up-line-item.dto';
import { UpdateFollowUpLineItemDto } from './dto/update-follow-up-line-item.dto';

@Injectable()
export class FollowUpLineItemsService {
  create(createFollowUpLineItemDto: CreateFollowUpLineItemDto) {
    return 'This action adds a new followUpLineItem';
  }

  findAll() {
    return `This action returns all followUpLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} followUpLineItem`;
  }

  update(id: number, updateFollowUpLineItemDto: UpdateFollowUpLineItemDto) {
    return `This action updates a #${id} followUpLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} followUpLineItem`;
  }
}
