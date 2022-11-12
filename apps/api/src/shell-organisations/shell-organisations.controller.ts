import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShellOrganisationsService } from './shell-organisations.service';
import { CreateShellOrganisationDto } from './dto/create-shell-organisation.dto';
import { UpdateShellOrganisationDto } from './dto/update-shell-organisation.dto';

@Controller('shell-organisations')
export class ShellOrganisationsController {
  constructor(private readonly shellOrganisationsService: ShellOrganisationsService) {}

  @Post()
  create(@Body() createShellOrganisationDto: CreateShellOrganisationDto) {
    return this.shellOrganisationsService.create(createShellOrganisationDto);
  }

  @Get()
  findAll() {
    return this.shellOrganisationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shellOrganisationsService.findOne(+id);
  }

  @Get('newCustomers/:id') 
  getNewCustomersByMonth(@Param('id') id: string) {
    return this.shellOrganisationsService.getNewCustomersByMonth(+id);
  }

  @Get('orgId/:id')
  findByOrg(@Param('id') id: string) {
    return this.shellOrganisationsService.findAllByOrg(+id)
  }

  @Get('orgId/:id/:uen')
  retrieveShellOrgFromUen(@Param('id') id: string, @Param('uen') uen: string) {
    return this.shellOrganisationsService.retrieveShellOrgFromUen(+id, uen)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShellOrganisationDto: UpdateShellOrganisationDto) {
    return this.shellOrganisationsService.update(+id, updateShellOrganisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shellOrganisationsService.remove(+id);
  }
}
