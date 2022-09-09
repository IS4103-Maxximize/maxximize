import { Injectable } from '@nestjs/common';
import { CreateShellOrganisationDto } from './dto/create-shell-organisation.dto';
import { UpdateShellOrganisationDto } from './dto/update-shell-organisation.dto';

@Injectable()
export class ShellOrganisationService {
  create(createShellOrganisationDto: CreateShellOrganisationDto) {
    return 'This action adds a new shellOrganisation';
  }

  findAll() {
    return `This action returns all shellOrganisation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shellOrganisation`;
  }

  update(id: number, updateShellOrganisationDto: UpdateShellOrganisationDto) {
    return `This action updates a #${id} shellOrganisation`;
  }

  remove(id: number) {
    return `This action removes a #${id} shellOrganisation`;
  }
}
