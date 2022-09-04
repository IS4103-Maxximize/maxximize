import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
  ) {}

  create(createOrganisationDto: CreateOrganisationDto): Promise<Organisation> {
    const organisation = new Organisation();
    organisation.name = createOrganisationDto.name;
    organisation.type = createOrganisationDto.organisationType;

    return this.organisationsRepository.save(organisation);
  }

  findAll() {
    return this.organisationsRepository.find();
  }

  findOne(id: number): Promise<Organisation> {
    return this.organisationsRepository.findOneBy({ id });
  }

  findOrganisationWorkers(id: number): Promise<User[]> {
    return this.findOne(id).then((organisation) => organisation.users);
  }

  async update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
    const organisation = await this.findOne(id);
    organisation.name = updateOrganisationDto.name;
    organisation.type = updateOrganisationDto.organisationType;

    return this.organisationsRepository.save(organisation); 
  }

  async directUpdate(organisation: Organisation) {
    return this.organisationsRepository.save(organisation);
  }

  async remove(id: number): Promise<void> {
    await this.organisationsRepository.delete(id);
  }
}
