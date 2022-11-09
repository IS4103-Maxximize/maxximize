import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  create(@Body() createOutletDto: CreateOutletDto) {
    return this.outletsService.create(createOutletDto);
  }

  @Get()
  findAll() {
    return this.outletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outletsService.findOne(+id);
  }

  @Get('orgId/:orgId')
  findByOrg(@Param('orgId') id: string) {
    return this.outletsService.findAllByOrg(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletsService.update(+id, updateOutletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletsService.remove(+id);
  }
}
