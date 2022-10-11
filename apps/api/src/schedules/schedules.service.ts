import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { ProductionLine } from '../production-lines/entities/production-line.entity';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleType } from './enums/scheduleType.enum';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private productionLineService: ProductionLinesService,
    private datasource: DataSource,
    private batchesService: BatchesService
  ) {}
  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
      const {start, end, status, productionLineId} = createScheduleDto
      let productionLineToBeAdded: ProductionLine
      let newSchedule: Schedule
      //need to update the nextAvailableDateTime in the production Line so wrap it in transaction
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (productionLineId) {
          productionLineToBeAdded = await transactionalEntityManager.findOneByOrFail(ProductionLine, {
            id: productionLineId
          })
        }
        newSchedule = transactionalEntityManager.create(Schedule, {
          start,
          end,
          status,
          productionLineId: productionLineToBeAdded.id ?? null
        })
        return transactionalEntityManager.save(newSchedule)
      })
      return newSchedule
  }

  findAll() {
    return this.scheduleRepository.find({
      relations: {
        productionLine: true,
        productionOrder: true
      }
    })
  }

  async findOne(id: number) {
    try {
      const schedule = await this.scheduleRepository.findOne({where: {
        id
      }, relations: {
        productionLine: true,
        productionOrder: true
      }})
      return schedule
    } catch (error) {
      throw new NotFoundException(`schedule with id: ${id} cannot be found!`)
    }
    
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const keyValuePairs = Object.entries(updateScheduleDto)
    const scheduleToUpdate = await this.findOne(id)
    for (const [key, value] of keyValuePairs){
      if (key === 'productionLineId') {
        await this.productionLineService.findOne(value)
      }
      scheduleToUpdate[key] = value
      
    }
    return this.scheduleRepository.save(scheduleToUpdate) 
  }

  async remove(id: number) {
    //dont anyhow remove schedules
    const scheduleToRemove = await this.findOne(id)
    return this.scheduleRepository.remove(scheduleToRemove)
  }

  async allocate(id: number, quantity: number) {
    let schedule: Schedule = await this.findOne(id)
    await this.datasource.manager.transaction(async (transactionalEntityManager) => {
      //await this.batchesService.createWithExistingTransaction()
      await transactionalEntityManager.update(Schedule, id, { status: ScheduleType.ALLOCATED})
      return null
    })
    return this.findOne(id)
  }
}
