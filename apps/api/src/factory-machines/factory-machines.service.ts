import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    private productionLineService: ProductionLinesService,
    private dataSource: DataSource ) {}
  async create(createFactoryMachineDto: CreateFactoryMachineDto): Promise<FactoryMachine> {
    const {serialNumber , description, isOperating, make, model, year, lastServiced, remarks, organisationId, productionLineId } = createFactoryMachineDto
    const organisation = await this.organisationService.findOne(organisationId)
    const productionLine = await this.productionLineService.findOne(productionLineId)
    const newFactoryMachine = this.factoryMachineRepository.create({
      serialNumber,
      description,
      isOperating,
      make,
      model,
      year,
      lastServiced,
      remarks,
      organisationId: organisation.id,
      productionLineId: productionLine.id
    })
    return this.factoryMachineRepository.save(newFactoryMachine)
    
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
    return this.factoryMachineRepository.createQueryBuilder('factoryMachine')
    .leftJoinAndSelect("factoryMachine.organisation", "organisation")
    .leftJoinAndSelect("factoryMachine.productionLine", "productionLine")
    .where("organisation.id = :id", {id})
    .getMany()
  }

 async update(id: number, updateFactoryMachineDto: UpdateFactoryMachineDto): Promise<FactoryMachine> {
    let factoryMachineToUpdate: FactoryMachine
    await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
      factoryMachineToUpdate = await transactionalEntityManager.findOne(FactoryMachine, {
        where: {
          id
        }
      })
      const productionLineId = factoryMachineToUpdate.productionLineId
      const keyValuePairs = Object.entries(updateFactoryMachineDto)
      for (const [key, value] of keyValuePairs) {
        if (key === 'isOperating' && factoryMachineToUpdate.productionLineId) {
          await this.productionLineService.machineTriggerChange(value, factoryMachineToUpdate.id, productionLineId, transactionalEntityManager)
        }
        if (key === 'productionLineId') {
          await this.productionLineService.findOne(value)
        }
        factoryMachineToUpdate[key] = value
      }
      return transactionalEntityManager.save(factoryMachineToUpdate)
    })
    return factoryMachineToUpdate
  }

  async remove(id: number): Promise<FactoryMachine> {
    const factoryMachineToDelete = await this.findOne(id)
    //can't remove FM if there is an ongoing schedule in the PL
    const productionLineId = factoryMachineToDelete.productionLineId
    const schedules = (await this.productionLineService.findOne(productionLineId)).schedules
    const hasOngoingSchedule = schedules.some(schedule => schedule.status === 'ongoing')
    if (!hasOngoingSchedule) {
      return this.factoryMachineRepository.remove(factoryMachineToDelete)
    } else {
      throw new NotFoundException('There is a schedule that is ongoing, delete Machine after this is done!')
    }

    
  }
}
