import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowUpLineItemsService } from './follow-up-line-items.service';
import { CreateFollowUpLineItemDto } from './dto/create-follow-up-line-item.dto';
import { UpdateFollowUpLineItemDto } from './dto/update-follow-up-line-item.dto';

@Controller('follow-up-line-items')
export class FollowUpLineItemsController {
  constructor(
    private readonly followUpLineItemsService: FollowUpLineItemsService
  ) {}

  @Post()
  create(@Body() createFollowUpLineItemDto: CreateFollowUpLineItemDto) {
    return this.followUpLineItemsService.create(createFollowUpLineItemDto);
  }

  @Get()
  findAll() {
    return this.followUpLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followUpLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFollowUpLineItemDto: UpdateFollowUpLineItemDto
  ) {
    return this.followUpLineItemsService.update(+id, updateFollowUpLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followUpLineItemsService.remove(+id);
  }
}
