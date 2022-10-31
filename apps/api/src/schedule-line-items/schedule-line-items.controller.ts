import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleLineItemsService } from './schedule-line-items.service';
import { CreateScheduleLineItemDto } from './dto/create-schedule-line-item.dto';
import { UpdateScheduleLineItemDto } from './dto/update-schedule-line-item.dto';

@Controller('schedule-line-items')
export class ScheduleLineItemsController {
  constructor(
    private readonly scheduleLineItemsService: ScheduleLineItemsService
  ) {}

  @Post()
  create(@Body() createScheduleLineItemDto: CreateScheduleLineItemDto) {
    return this.scheduleLineItemsService.create(createScheduleLineItemDto);
  }

  @Get()
  findAll() {
    return this.scheduleLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleLineItemDto: UpdateScheduleLineItemDto
  ) {
    return this.scheduleLineItemsService.update(+id, updateScheduleLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleLineItemsService.remove(+id);
  }
}
