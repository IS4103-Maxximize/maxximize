import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShellOrganisationService } from './shell-organisation.service';
import { CreateShellOrganisationDto } from './dto/create-shell-organisation.dto';
import { UpdateShellOrganisationDto } from './dto/update-shell-organisation.dto';

@Controller('shell-organisation')
export class ShellOrganisationController {
  constructor(
    private readonly shellOrganisationService: ShellOrganisationService
  ) {}

  @Post()
  create(@Body() createShellOrganisationDto: CreateShellOrganisationDto) {
    return this.shellOrganisationService.create(createShellOrganisationDto);
  }

  @Get()
  findAll() {
    return this.shellOrganisationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shellOrganisationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShellOrganisationDto: UpdateShellOrganisationDto
  ) {
    return this.shellOrganisationService.update(
      +id,
      updateShellOrganisationDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shellOrganisationService.remove(+id);
  }
}
