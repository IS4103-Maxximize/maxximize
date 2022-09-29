import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from 'handlebars';
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
    const {name, description, finalGoodId, productionCostPerLot, gracePeriod, organisationId, outputPerHour, startTime, endTime} = createProductionLineDto

    const organisation = await this.organisationService.findOne(organisationId)
    const finalGood = await this.finalGoodService.findOne(finalGoodId)
    const newProductionLine = this.productionLineRepository.create({
      name,
      description,
      productionCostPerLot,
      gracePeriod: gracePeriod,
      created: new Date(),
      finalGoodId: finalGood.id,
      isAvailable: true,
      lastStopped: null,
      outputPerHour,
      organisationId: organisation.id ,
      startTime,
      endTime
    })
    const newPL =  await this.productionLineRepository.save(newProductionLine)
    return this.findOne(newPL.id);
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

  async findOne(id: number): Promise<ProductionLine> {
    try {
      return await this.productionLineRepository.findOneOrFail({where: {
        id
      }, relations: {
        finalGood: true,
        schedules: true,
        organisation: true,
        machines: true
      }})
    } catch (error) {
      throw new NotFoundException(`findOne failed as ProductionLine with id: ${id} cannot be found`)
    }
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
    for (const [key, value] of keyValuePairs) {
      productionLineToUpdate[key] = value
    }
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

  async getNextEarliestMapping(finalGoodId: number) {
    const allProductionLines = await this.findAll()
    const productionLines = allProductionLines.filter(productionLine => productionLine.finalGoodId === finalGoodId)
    let mapping = {}
    for (let i = 0; i < productionLines.length; i++) {
      const map = new Map()
      const schedules = productionLines[i].schedules
      schedules.forEach(schedule => {
        const dateTime =  schedule.end
        const dateKey = this.convertDateToStringFormat(dateTime)
        if (map.has(dateKey)) {
          if (dateTime.getTime() > map.get(dateKey)) {
            map.set(dateKey, dateTime.getTime() + productionLines[i].gracePeriod)
          }
        } else {
          map.set(dateKey, dateTime.getTime() + productionLines[i].gracePeriod)
        }
      })
      const parsedMap = Object.fromEntries(map)
      mapping[productionLines[i].id] = parsedMap
    }
    // console.log(await this.getNextAvailableNearestDateTime(mapping))
    return mapping
  }

  convertDateToStringFormat(date: Date) {
    const parts = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    const dateKey = parts.join('/')
    return dateKey
  }

  convertStringToDateFormat(string: string) {
    const parts = string.split('/')
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  }

  async getNextAvailableNearestDateTime(mapping: Object, daily: Boolean) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateKey = this.convertDateToStringFormat(tomorrow)
    let nextAvailableNearestDateTime = new Date(3000, 0, 1).getTime()
    let nextAvailableProdLineId: number
    const prodSchedulesPairs = Object.entries(mapping)
    for (let i = 0; i < prodSchedulesPairs.length; i++) {
      const productionId = prodSchedulesPairs[i][0]
      const productionLine = await this.findOne(+productionId)
      const schedulesObject: Object = prodSchedulesPairs[i][1]
      const schedulesMap = new Map(Object.entries(schedulesObject))

      // 2 cases Daily or not
      //CASE 1 (Daily)
      if (daily) {
        let currentDateKey = dateKey
        let currentDate = new Date(tomorrow)
        while (schedulesMap.has(currentDateKey)) {
          currentDate.setDate(currentDate.getDate() + 1)
          currentDateKey = this.convertDateToStringFormat(currentDate)
        }
        //at this point, the date does not have any schedule
        const earliestDateTime =  this.convertStringToDateFormat(currentDateKey).setHours(productionLine.startTime, 0, 0)
        if (earliestDateTime < nextAvailableNearestDateTime) {
          nextAvailableNearestDateTime = earliestDateTime
          nextAvailableProdLineId = +productionId
        }
      } else {
        //CASE 2 (NOT DAILY)
        let earliestDateTime: number
        if (!schedulesMap.has(dateKey)) {
          if (nextAvailableNearestDateTime !== tomorrow.getTime()) {
            nextAvailableNearestDateTime = tomorrow.setHours(productionLine.startTime, 0, 0)
            nextAvailableProdLineId = +productionId
          }
        } else {
          //schedulesMap contain the dateKey
          earliestDateTime =  schedulesMap.get(dateKey)
          let endOfDay = new Date(earliestDateTime).setHours(productionLine.endTime, 0, 0)
          const hourDuration = 1 * 60 * 60 * 1000
          let key = dateKey
          while (endOfDay - earliestDateTime < hourDuration) {
            const currentDate = this.convertStringToDateFormat(key)
            const nextDay = new Date(currentDate)
            nextDay.setDate(currentDate.getDate() + 1)
            key = this.convertDateToStringFormat(nextDay)
            earliestDateTime = schedulesMap.get(key) ?? nextDay.setHours(productionLine.startTime, 0, 0)
            endOfDay = new Date(earliestDateTime).setHours(productionLine.endTime, 0, 0)
          }
          if (earliestDateTime < nextAvailableNearestDateTime) {
            nextAvailableNearestDateTime = earliestDateTime
            nextAvailableProdLineId = +productionId
          }
        }
      }
    }
    return {
      productionLineId: nextAvailableProdLineId,
      nextAvailableNearestDateTime: nextAvailableNearestDateTime
    }

  }

  async retrieveSchedulesForProductionOrder(quantity: number, finalGoodId: number, daily: Boolean, days: number) {
    const schedules = []
    let requiredQuantity = quantity
    let mapping =  await this.getNextEarliestMapping(finalGoodId)
    let nextAvailablePlandTime = await this.getNextAvailableNearestDateTime(mapping, daily)
    let {productionLineId, nextAvailableNearestDateTime} = nextAvailablePlandTime
    let productionLine = await this.findOne(productionLineId)
    let timeRequiredInMilliseconds = (requiredQuantity / productionLine.outputPerHour) * 60 * 60 * 1000
    let endOfDayOfNextAvailableTime = new Date(nextAvailableNearestDateTime).setHours(productionLine.endTime, 0, 0)
    if (daily) {
      if (timeRequiredInMilliseconds > endOfDayOfNextAvailableTime - nextAvailableNearestDateTime) {
        throw new NotFoundException('Quantity Exceeds the daily limit!')
      }
      let start = new Date(nextAvailableNearestDateTime)
      for (let i = 0; i < days; i++) {
        schedules.push({
          productionLineId: productionLineId,
          start: new Date(start),
          end: new Date(start.getTime() + timeRequiredInMilliseconds)
        })
        start = new Date(start.setDate(start.getDate() + 1))
      }
    } else {
      while (requiredQuantity > 0) {
        //get the next earliest time slot and calculate quantity that is able to fit into this timeslot
        nextAvailablePlandTime = await this.getNextAvailableNearestDateTime(mapping, daily)
        const {productionLineId, nextAvailableNearestDateTime} = nextAvailablePlandTime
        productionLine = await this.findOne(productionLineId)
        timeRequiredInMilliseconds = (requiredQuantity / productionLine.outputPerHour) * 60 * 60 * 1000
        endOfDayOfNextAvailableTime = new Date(nextAvailableNearestDateTime).setHours(productionLine.endTime, 0, 0)
        
        if (timeRequiredInMilliseconds > endOfDayOfNextAvailableTime - nextAvailableNearestDateTime) {
          //it exceeds the end of day, so have to reduce the requiredQty
          const outputWithinFrame = Math.round((endOfDayOfNextAvailableTime - nextAvailableNearestDateTime) / 3600000 * productionLine.outputPerHour)
          requiredQuantity -= outputWithinFrame
  
          //save this schedule
          schedules.push({
            productionLineId: productionLineId,
            start: new Date(nextAvailableNearestDateTime),
            end: new Date(endOfDayOfNextAvailableTime)
          })
  
          //need to update the mapping
          const keyDateToUpdate = this.convertDateToStringFormat(new Date(nextAvailableNearestDateTime))
          mapping[productionLineId][keyDateToUpdate] = endOfDayOfNextAvailableTime
        } else {
          //if its within the end of day, required Quantity becomes 0
          requiredQuantity = 0
          //save this schedule
          schedules.push({
            productionLineId: productionLineId,
            start: new Date(nextAvailableNearestDateTime),
            end: new Date(nextAvailableNearestDateTime + timeRequiredInMilliseconds)
          })
          //don't need to update the mapping
        }
      }
    }
    return schedules
  }

  // async machineTriggerChange(machineIsOperating: Boolean, machineId: number, productionLineId: number, entityManager: EntityManager) {
  //   //if its true, check if the status of productionLine is not available 
  //   //check if there are other machines that are false, 
  //   //If there are, do nothing
  //   //if this is the only one, update status of PL to true and update all schdules with the time elapsed 
  //   const productionLine = await entityManager.findOneOrFail(ProductionLine, {
  //     where: {
  //       id: productionLineId
  //     },
  //     relations: {
  //       schedules: true,
  //       machines: true
  //     }
  //   })
  //   const schedules = productionLine.schedules
  //   const machines = productionLine.machines
  //   if (machineIsOperating) {
  //     if (!productionLine.isAvailable) {
  //       const machinesNotInOperation = machines.filter(machine => !machine.isOperating)
  //       if (machinesNotInOperation.length === 1 && machinesNotInOperation[0].id === machineId) {
  //         const timeElapsedInMilliseconds = new Date().getTime() - productionLine.lastStopped.getTime()
  //         //update ongoing schedule
  //         const ongoingSchedule = schedules.filter(schedule => schedule.status === 'ongoing')
  //         if (ongoingSchedule.length === 1) {
  //           const schedule = ongoingSchedule[0]
  //           const newEndTime = new Date(schedule.end).getTime() + timeElapsedInMilliseconds
  //           await entityManager.update(Schedule, schedule.id, {end: new Date(newEndTime)})
  //         } 
  //         productionLine.lastStopped = null
  //         productionLine.isAvailable = true
  //         await entityManager.save(ProductionLine, productionLine)
  //       }
  //     }
  //   } else {
  //       //if value is false
  //       if (productionLine.isAvailable) {
  //         productionLine.isAvailable = false
  //         productionLine.lastStopped = new Date()
  //         await entityManager.save(productionLine)
  //       }
  //   }
  // }
}
