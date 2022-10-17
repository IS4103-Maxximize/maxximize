import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChronJobsService } from './chron-jobs.service';
import { CreateChronJobDto } from './dto/create-chron-job.dto';
import { UpdateChronJobDto } from './dto/update-chron-job.dto';

@Controller('chron-jobs')
export class ChronJobsController {
  constructor(private readonly chronJobsService: ChronJobsService) {}

  @Post()
  create(@Body() createChronJobDto: CreateChronJobDto) {
    return this.chronJobsService.create(createChronJobDto);
  }

  @Get()
  findAll() {
    return this.chronJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chronJobsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chronJobsService.remove(+id);
  }
}
