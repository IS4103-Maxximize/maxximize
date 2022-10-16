import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { LineItem } from '../line-Items/LineItem';
import { ProductionLine } from '../production-lines/entities/production-line.entity';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleType } from './enums/scheduleType.enum';
import {Batch} from '../batches/entities/batch.entity';
import { AllocateScheduleDto } from './dto/allocate-schedule.dto';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { ProductionOrderStatus } from '../production-orders/enums/production-order-status.enum';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @Inject(forwardRef(() => ProductionLinesService))
    private productionLineService: ProductionLinesService,
    private datasource: DataSource,
    @Inject(forwardRef(() => BatchesService))
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
          productionLineId: productionLineToBeAdded.id ?? null,
          //REMOVE THIS (Required for testing)
          // finalGoodId: finalGoodId
        })
        return transactionalEntityManager.save(newSchedule)
      })
      return newSchedule
  }

  findAll() {
    return this.scheduleRepository.find({
      relations: {
        //REMOVE THIS (Required for testing)
        // finalGood: true,
        productionLine: true,
        completedGoods: true,
        prodLineItems: {
          rawMaterial: true,
          batchLineItem: true
        },
        productionOrder: {
          bom: {
            finalGood:true
          }
        }
      }
    })
  }

  async findOne(id: number) {
    try {
      const schedule = await this.scheduleRepository.findOne({where: {
        id
      }, relations: {
        //REMOVE THIS (Required for testing)
        // finalGood: true,
        productionLine: true,
        completedGoods: true,
        prodLineItems: {
          rawMaterial: true,
          batchLineItem: true
        },
        productionOrder: {
          bom: {
            finalGood:true
          }
        }
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

  async allocate(allocateScheduleDto: AllocateScheduleDto) {
    const {orgId, scheduleId, quantity } = allocateScheduleDto
    let schedule: Schedule = await this.findOne(scheduleId)
    await this.datasource.manager.transaction(async (transactionalEntityManager) => {
      let newBatch: Batch;
      newBatch = await this.batchesService.allocate(orgId, schedule.productionOrder.bom.finalGood.id, quantity)
      // const batch = await transactionalEntityManager.create(Batch, {
      //   batchNumber: newBatch.batchNumber,
      //   organisationId: orgId,
      //   batchLineItems: newBatch.batchLineItems
      // })

      console.log(await transactionalEntityManager.save(newBatch))
      // for (const lineItem of batch.batchLineItems) {
      //   await transactionalEntityManager.save(lineItem)
      // }
      await transactionalEntityManager.update(Schedule, scheduleId, { status: ScheduleType.ALLOCATED})
      let productionOrder : ProductionOrder = await transactionalEntityManager.findOne(ProductionOrder, {
        where: {
          id: schedule.productionOrder.id
        }, relations: {
          schedules: true
        }
      })
      let checker = true
      for (const sche of productionOrder.schedules) {
        if (!(sche.status == ScheduleType.ALLOCATED)) {
          checker = false
        }
      }
      if (checker) {
        await transactionalEntityManager.update(ProductionOrder, schedule.productionOrder.id, {status: ProductionOrderStatus.ALLOCATED})
      }
      return null
    })
    return this.findOne(scheduleId)
  }
}
