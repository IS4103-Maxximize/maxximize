import { Injectable } from '@nestjs/common';
import { CreateScheduleLineItemDto } from './dto/create-schedule-line-item.dto';
import { UpdateScheduleLineItemDto } from './dto/update-schedule-line-item.dto';

@Injectable()
export class ScheduleLineItemsService {
  create(createScheduleLineItemDto: CreateScheduleLineItemDto) {
    return 'This action adds a new scheduleLineItem';
  }

  findAll() {
    return `This action returns all scheduleLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleLineItem`;
  }

  update(id: number, updateScheduleLineItemDto: UpdateScheduleLineItemDto) {
    return `This action updates a #${id} scheduleLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleLineItem`;
  }
}
