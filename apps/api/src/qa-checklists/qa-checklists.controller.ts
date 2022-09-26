import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaChecklistsService } from './qa-checklists.service';
import { CreateQaChecklistDto } from './dto/create-qa-checklist.dto';
import { UpdateQaChecklistDto } from './dto/update-qa-checklist.dto';

@Controller('qa-checklists')
export class QaChecklistsController {
  constructor(private readonly qaChecklistsService: QaChecklistsService) {}

  @Post()
  create(@Body() createQaChecklistDto: CreateQaChecklistDto) {
    return this.qaChecklistsService.create(createQaChecklistDto);
  }

  @Get()
  findAll() {
    return this.qaChecklistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaChecklistsService.findOne(+id);
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.qaChecklistsService.findAllByOrg(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQaChecklistDto: UpdateQaChecklistDto) {
    return this.qaChecklistsService.update(+id, updateQaChecklistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaChecklistsService.remove(+id);
  }
}
