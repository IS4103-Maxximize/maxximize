import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { Outlet } from './entities/outlet.entity';

@Injectable()
export class OutletsService {
  constructor(
    @InjectRepository(Outlet)
    private readonly outletsRepository: Repository<Outlet>,
    private organisationService: OrganisationsService
  ) {}
  async create(createOutletDto: CreateOutletDto) {
    const {organisationId, name, address} = createOutletDto
    const organisation = await this.organisationService.findOne(organisationId)
    const newOutlet = this.outletsRepository.create({
      name,
      address,
      organisation
    })
    return this.outletsRepository.save(newOutlet)
  }

  findAll() {
    return this.outletsRepository.find()
  }

  findAllByOrg(orgId: number) {
    return this.outletsRepository.find({
      where: {
        organisationId: orgId
      }
    }) 
  }

  async findOne(id: number) {
    try {
      return await this.outletsRepository.findOneOrFail({
        where: {
          id
        }
      })
    } catch (error) {
      throw new NotFoundException(`outlet with this id: ${id} cannot be found!`)
    }
  }

  async update(id: number, updateOutletDto: UpdateOutletDto) {
    const outletToUpdate = await this.findOne(id)
    const keyValues = Object.entries(updateOutletDto)
    for (const [key, value] of keyValues) {
      outletToUpdate[key] = value
    }
    return this.outletsRepository.save(outletToUpdate)
  }

  async remove(id: number) {
    const outletToRemove = await this.findOne(id)
    return this.outletsRepository.remove(outletToRemove)
  }
}
