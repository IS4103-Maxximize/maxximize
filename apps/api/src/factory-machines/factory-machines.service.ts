import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { CreateFactoryMachineDto } from './dto/create-factory-machine.dto';
import { UpdateFactoryMachineDto } from './dto/update-factory-machine.dto';
import { FactoryMachine } from './entities/factory-machine.entity';

@Injectable()
export class FactoryMachinesService {
  constructor(private organisationService: OrganisationsService,
    @InjectRepository(FactoryMachine)
    private readonly factoryMachineRepository: Repository<FactoryMachine>,
    @Inject(forwardRef(() => ProductionLinesService))
    private productionLinesService: ProductionLinesService,
    ) {}
  async create(createFactoryMachineDto: CreateFactoryMachineDto): Promise<FactoryMachine> {
    try {
      const {serialNumber , description, isOperating, make, model, year, lastServiced, remarks, organisationId } = createFactoryMachineDto
      const organisation = await this.organisationService.findOne(organisationId)
      const newFactoryMachine = this.factoryMachineRepository.create({
        serialNumber,
        description,
        isOperating,
        make,
        model,
        year,
        lastServiced,
        remarks,
        organisationId: organisation.id
      })
      const newMachine = await this.factoryMachineRepository.save(newFactoryMachine)
      return this.findOne(newMachine.id);
    } catch(error) {
      throw new NotFoundException(error.message)
    }
  }

  findAll(): Promise<FactoryMachine[]> {
    return this.factoryMachineRepository.find({
      relations: {
        organisation: true,
        productionLine: true
      }
    })
  }

  async findOne(id: number): Promise<FactoryMachine> {
    try {
      const factoryMachine = await this.factoryMachineRepository.findOneOrFail({where: {
        id
      }, relations: {
        organisation: true,
        productionLine: true
      }})
      return factoryMachine
    } catch (error) {
      throw new NotFoundException(`factory machine with id: ${id} cannot be found`)
    }
    
  }

  findAllByOrg(id: number): Promise<FactoryMachine[]> {
    return this.factoryMachineRepository.find({
      where: {
        organisationId: id
      }, relations: {
        productionLine: true
      }
    })
  }

 async update(id: number, updateFactoryMachineDto: UpdateFactoryMachineDto): Promise<FactoryMachine> {
    let factoryMachineToUpdate: FactoryMachine
    factoryMachineToUpdate = await this.findOne(id)
    // const productionLineId = factoryMachineToUpdate.productionLineId
    const keyValuePairs = Object.entries(updateFactoryMachineDto)
    for (const [key, value] of keyValuePairs) {
      factoryMachineToUpdate[key] = value
    }
    return this.factoryMachineRepository.save(factoryMachineToUpdate)
  }

  async remove(id: number): Promise<FactoryMachine> {
    const factoryMachineToDelete = await this.findOne(id)
    //can't remove FM if there is an ongoing schedule in the PL
	if (factoryMachineToDelete.productionLineId) {
	  const productionLineId = factoryMachineToDelete.productionLineId
      const schedules = (await this.productionLinesService.findOne(productionLineId)).schedules
      const hasOngoingPlannedSchedule = schedules.some(schedule => schedule.status === 'ongoing' || schedule.status === 'planned')
      if (!hasOngoingPlannedSchedule) {
        return this.factoryMachineRepository.remove(factoryMachineToDelete)
      } else {
        throw new BadRequestException('There is a schedule that is ongoing/planned, delete Machine after these are done!')
	  }
    } else {
	  return this.factoryMachineRepository.remove(factoryMachineToDelete)
	}
  }
}
