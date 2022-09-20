import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FactoryMachinesService } from './factory-machines.service';
import { CreateFactoryMachineDto } from './dto/create-factory-machine.dto';
import { UpdateFactoryMachineDto } from './dto/update-factory-machine.dto';

@Controller('factory-machines')
export class FactoryMachinesController {
  constructor(private readonly factoryMachinesService: FactoryMachinesService) {}

  @Post()
  create(@Body() createFactoryMachineDto: CreateFactoryMachineDto) {
    return this.factoryMachinesService.create(createFactoryMachineDto);
  }

  @Get()
  findAll() {
    return this.factoryMachinesService.findAll();
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.factoryMachinesService.findAllByOrg(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factoryMachinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactoryMachineDto: UpdateFactoryMachineDto) {
    return this.factoryMachinesService.update(+id, updateFactoryMachineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factoryMachinesService.remove(+id);
  }
}
