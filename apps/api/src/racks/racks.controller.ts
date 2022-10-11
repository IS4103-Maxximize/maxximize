import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RacksService } from './racks.service';
import { CreateRackDto } from './dto/create-rack.dto';
import { UpdateRackDto } from './dto/update-rack.dto';

@Controller('racks')
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

  @Post()
  create(@Body() createRackDto: CreateRackDto) {
    return this.racksService.create(createRackDto);
  }

  @Get()
  findAll() {
    return this.racksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.racksService.findOne(+id);
  }

  @Get('getAllByOrgId/:id')
  findAllByOrgId(@Param('id') id: number) {
    return this.racksService.findAllByOrganisationId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRackDto: UpdateRackDto) {
    return this.racksService.update(+id, updateRackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.racksService.remove(+id);
  }
}
