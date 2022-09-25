import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BinsService } from './bins.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Controller('bins')
export class BinsController {
  constructor(private readonly binsService: BinsService) {}

  @Post()
  create(@Body() createBinDto: CreateBinDto) {
    return this.binsService.create(createBinDto);
  }

  @Get()
  findAll() {
    return this.binsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.binsService.findOne(+id);
  }

  @Get('findAllByOrgId/:id')
  findAllByOrgId(@Param('id') id: string) {
    return this.binsService.findAllByOrganisationId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBinDto: UpdateBinDto) {
    return this.binsService.update(+id, updateBinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.binsService.remove(+id);
  }
}
