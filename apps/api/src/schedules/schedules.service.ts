import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductionLine } from '../production-lines/entities/production-line.entity';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private productionLineService: ProductionLinesService,
    private datasource: DataSource
  ) {}
  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
      const {start, end, status, productionLineId} = createScheduleDto
      let productionLineToBeAdded: ProductionLine
      let newSchedule: Schedule
      //need to update the nextAvailableDateTime in the production Line so wrap it in transaction
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (productionLineId) {
          productionLineToBeAdded = await transactionalEntityManager.findOneBy(ProductionLine, {
            id: productionLineId
          })
          //pass in the new end date into the service method
          await this.productionLineService.updateNextAvailable(productionLineToBeAdded.id, end, transactionalEntityManager)
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
        productionLine: true
      }
    })
  }

  findOne(id: number) {
    return this.scheduleRepository.findOne({where: {
      id
    }, relations: {
      productionLine: true
    }})
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const keyValuePairs = Object.entries(updateScheduleDto)
    const scheduleToUpdate = await this.findOne(id)
    keyValuePairs.forEach(([key, value]) => {
      if (value) {
        scheduleToUpdate[key] = value
      }
    })
    return this.scheduleRepository.save(scheduleToUpdate) 
  }

  async remove(id: number) {
    const scheduleToRemove = await this.findOne(id)
    return this.scheduleRepository.remove(scheduleToRemove)
  }
}
