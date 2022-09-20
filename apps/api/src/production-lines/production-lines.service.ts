import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { Schedule } from '../schedules/entities/schedule.entity';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { ProductionLine } from './entities/production-line.entity';

@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectRepository(ProductionLine)
    private readonly productionLineRepository: Repository<ProductionLine>,
    private finalGoodService: FinalGoodsService,
    private organisationService: OrganisationsService
  ) {}
  async create(createProductionLineDto: CreateProductionLineDto): Promise<ProductionLine> {
    try {
      const {name, description, finalGoodId, productionCostPerLot, changeOverTime, organisationId} = createProductionLineDto
  
      const organisation = await this.organisationService.findOne(organisationId)
      const finalGood = await this.finalGoodService.findOne(finalGoodId)
      const newProductionLine = this.productionLineRepository.create({
        name,
        description,
        productionCostPerLot,
        changeOverTime: changeOverTime,
        created: new Date(),
        nextAvailableDateTime: new Date(),
        finalGoodId: finalGood.id,
        isAvailable: true,
        lastStopped: null,
        organisationId: organisation.id
      })
      return this.productionLineRepository.save(newProductionLine)
    } catch (error) {
      throw new NotFoundException(`Final good with id: ${createProductionLineDto.finalGoodId} provided cannot be found!`)
    }
   
  }

  async findAll(): Promise<ProductionLine[]> {
    return this.productionLineRepository.find({
      relations: {
        finalGood: true,
        schedules: true,
        organisation: true,
        machines: true
      }
    })
  }

  findOne(id: number): Promise<ProductionLine> {
    return this.productionLineRepository.findOne({where: {
      id
    }, relations: {
      finalGood: true,
      schedules: true,
      organisation: true,
      machines: true
    }})
  }

  async findAllByOrg(id: number): Promise<ProductionLine[]> {
    return this.productionLineRepository.find({where: {
      organisationId: id
    }, relations: {
      finalGood: true,
      schedules: true,
      machines: true,
    }})
  }

  async update(id: number, updateProductionLineDto: UpdateProductionLineDto): Promise<ProductionLine> {
    const productionLineToUpdate = await this.findOne(id)
    const keyValuePairs = Object.entries(updateProductionLineDto)
    keyValuePairs.forEach(([key, value]) => {
      productionLineToUpdate[key] = value
    })
    return this.productionLineRepository.save(productionLineToUpdate)
  }

  async remove(id: number): Promise<ProductionLine> {
    //only can remove if all schedules are completed
    const productionLineToRemove = await this.findOne(id)
    const ongoingSchedules = productionLineToRemove.schedules.some(schedule => schedule.status === 'ongoing')
    if (!ongoingSchedules) {
      return this.productionLineRepository.remove(productionLineToRemove)
    } else {
      throw new NotFoundException('error deleting production line as there is an ongoing schedule')
    }
    
  }

  async updateNextAvailable(id: number, newScheduleEndDate: Date, entityManager: EntityManager) {
    const productionLine = await entityManager.findOneBy(ProductionLine, {
      id
    })
    const endDateInMilliseconds = new Date(newScheduleEndDate).getTime()
    const nextAvailableDTInMilliseconds = endDateInMilliseconds + productionLine.changeOverTime
    const nextAvailableDTInDateObject = new Date(nextAvailableDTInMilliseconds)
    await entityManager.update(ProductionLine, productionLine.id, {nextAvailableDateTime: nextAvailableDTInDateObject})
  }

  async machineTriggerChange(machineIsOperating: Boolean, machineId: number, productionLineId: number, entityManager: EntityManager) {
    //if its true, check if the status of productionLine is not available 
    //check if there are other machines that are false, 
    //If there are, do nothing
    //if this is the only one, update status of PL to true and update all schdules with the time elapsed 
    const productionLine = await entityManager.findOne(ProductionLine, {
      where: {
        id: productionLineId
      },
      relations: {
        schedules: true,
        machines: true
      }
    })
    const schedules = productionLine.schedules
    const machines = productionLine.machines
    if (machineIsOperating) {
      if (!productionLine.isAvailable) {
        const machinesNotInOperation = machines.filter(machine => !machine.isOperating)
        if (machinesNotInOperation.length === 1 && machinesNotInOperation[0].id === machineId) {
          const timeElapsedInMilliseconds = new Date().getTime() - productionLine.lastStopped.getTime()
          //update ongoing schedule
          const ongoingSchedule = schedules.filter(schedule => schedule.status === 'ongoing')
          if (ongoingSchedule.length === 1) {
            const schedule = ongoingSchedule[0]
            const newEndTime = new Date(schedule.end).getTime() + timeElapsedInMilliseconds
            await entityManager.update(Schedule, schedule.id, {end: new Date(newEndTime)})
          } 
          //update nextAvailableDateTime
          const newNextAvailableDateTime = new Date(productionLine.nextAvailableDateTime).getTime() + timeElapsedInMilliseconds
          productionLine.nextAvailableDateTime =  new Date(newNextAvailableDateTime)
          productionLine.lastStopped = null
          productionLine.isAvailable = true
          await entityManager.save(ProductionLine, productionLine)
        }
      }
    } else {
        //if value is false
        if (productionLine.isAvailable) {
          productionLine.isAvailable = false
          productionLine.lastStopped = new Date()
          await entityManager.save(productionLine)
        }
    }
  }
}
