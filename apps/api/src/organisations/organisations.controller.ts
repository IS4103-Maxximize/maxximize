import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { GetOrgByShellDto } from './dto/get-org-by-shell.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  findAll() {
    return this.organisationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organisationsService.findOne(+id);
  }

  @Get('email/:email')
  findOrgByEmail(@Param('email') email: string) {
    return this.organisationsService.findOrgByEmail(email);
  }

  @Post('getOrgByShellUen') 
  getOrgByShellUen(@Body() getOrgByShellDto: GetOrgByShellDto) {
    return this.organisationsService.findOrganisationsThatMatchesShellOrgUEN(getOrgByShellDto)
  }

  @Post('registerOrgAndUser')
  registerOrgAndUser(@Body() registerDto: RegisterDto) {
    return this.organisationsService.registerOrganisationAndUser(registerDto.createOrganisationDto, registerDto.createUserDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
    return this.organisationsService.update(+id, updateOrganisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organisationsService.remove(+id);
  }

  @Get('getWorkersByOrganisation/:id')
  findOrganisationWorkers(@Param('id') id: string) {
    return this.organisationsService.findOrganisationWorkers(+id);
  }
  
  //ban
  @Patch('ban/:id')
  banOrganisation(@Param('id') id: string) {
    return this.organisationsService.banOrganisation(+id)
  }

  //unban
  @Patch('unban/:id')
  unbanOrganisation(@Param('id') id: string) {
    return this.organisationsService.unbanOrganisation(+id)
  }
}
