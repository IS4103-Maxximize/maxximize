import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from 'handlebars';
import { __values } from 'tslib';
import { EntityManager, Repository } from 'typeorm';
import { BillOfMaterialsService } from '../bill-of-materials/bill-of-materials.service';
import { FactoryMachinesService } from '../factory-machines/factory-machines.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { Schedule } from '../schedules/entities/schedule.entity';
import { SchedulesService } from '../schedules/schedules.service';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { ProductionLine } from './entities/production-line.entity';

@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectRepository(ProductionLine)
    private readonly productionLineRepository: Repository<ProductionLine>,
    private bomService: BillOfMaterialsService,
    private organisationService: OrganisationsService,
    @Inject(forwardRef(() => FactoryMachinesService))
    private factoryMachinesService: FactoryMachinesService,
    @Inject(forwardRef(() => SchedulesService))
    private scheduleService: SchedulesService
  ) {}
  async create(createProductionLineDto: CreateProductionLineDto): Promise<ProductionLine> {
    const {name, description, bomIds, productionCostPerLot, gracePeriod, organisationId, outputPerHour, startTime, endTime, machineIds} = createProductionLineDto
    let machinesToBeAdded = []
    const bomsToBeAdded = []
    for (const id of machineIds) {
      const machine = await this.factoryMachinesService.findOne(id)
      machinesToBeAdded.push(machine)
    }
    const organisation = await this.organisationService.findOne(organisationId)
    for (const id of bomIds) {
      const bom = await this.bomService.findOne(id)
      if (bom) {
        bomsToBeAdded.push(bom)
      }
    }
    const newProductionLine = this.productionLineRepository.create({
      name,
      description,
      productionCostPerLot,
      gracePeriod: gracePeriod,
      created: new Date(),
      boms: bomsToBeAdded,
      isAvailable: true,
      lastStopped: null,
      outputPerHour,
      organisationId: organisation.id ,
      startTime,
      endTime,
      machines: machinesToBeAdded 
    })
    const newPL =  await this.productionLineRepository.save(newProductionLine)
    return this.findOne(newPL.id);
  }

  async findAll(): Promise<ProductionLine[]> {
    return this.productionLineRepository.find({
      relations: {
        boms: {
			finalGood:true
		},
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
        boms: {
          finalGood: true
        },
        schedules: true,
        organisation: true,
        machines: true
      }})
    } catch (error) {
      throw new NotFoundException(`findOne failed as ProductionLine with id: ${id} cannot be found`)
    }
  }

  async findAllByOrg(id: number): Promise<ProductionLine[]> {
    const [productionLines, count] = await this.productionLineRepository.findAndCount({
      where: {
        organisationId: id
      }, relations: {
        boms: {
          finalGood: true
        },
        schedules: true,
        machines: true
      }
    })
    if (count > 0) {
      return productionLines
    } else {
      throw new NotFoundException('No production Lines found!')
    }
  }

  async update(id: number, updateProductionLineDto: UpdateProductionLineDto): Promise<ProductionLine> {
    const productionLineToUpdate = await this.findOne(id)
    const keyValuePairs = Object.entries(updateProductionLineDto)
    for (const [key, value] of keyValuePairs) {
      if (value) {
        if (key === 'machineIds') {
          const newMachines = []
          for (const id of value) {
            newMachines.push(await this.factoryMachinesService.findOne(id))
          }
          productionLineToUpdate['machines'] = newMachines
        } else if (key === 'bomIds') {
          const newBoms = []
          for (const id of value) {
            newBoms.push(await this.bomService.findOne(id))
          }
          productionLineToUpdate.boms = newBoms
        } else {
          productionLineToUpdate[key] = value
        }
      }
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

  async getNextEarliestMapping(finalGoodId: number, organisationId: number) {
    const allProductionLines = await this.findAllByOrg(organisationId)
    //get productionLines that is able to produce this finalGood
    const productionLines = allProductionLines.filter(productionLine => {
      const boms = productionLine.boms
      if (boms.some(bom => bom.finalGood.id === finalGoodId)) {
        return productionLine
      }
    })
    let mapping = {}
    for (let i = 0; i < productionLines.length; i++) {
      const map = new Map()
      const schedules = productionLines[i].schedules
      schedules.forEach(schedule => {
        const dateTime =  schedule.end
        const dateKey = this.convertDateToStringFormat(dateTime)
        if (map.has(dateKey)) {
          if (dateTime.getTime() > map.get(dateKey)) {
            map.set(dateKey, dateTime.getTime())
          }
        } else {
          map.set(dateKey, dateTime.getTime())
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

  async getNextAvailableNearestDateTime(mapping: Object, startDate: Date, finalGoodId: number) {
    const today = startDate ?? new Date()
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

      let earliestDateTime: number
      if (!schedulesMap.has(dateKey)) {
        if (nextAvailableNearestDateTime !== tomorrow.getTime()) {
          nextAvailableNearestDateTime = tomorrow.setHours(productionLine.startTime, 0, 0)
          nextAvailableProdLineId = +productionId
        }
      } else {
        //schedulesMap contain the dateKey
        earliestDateTime =  schedulesMap.get(dateKey)
        //need to include Change over time if the finalGoodId doesnt match the previous schedule within that day
        const previousSchedule = this.getLatestScheduleOfProductionLine(productionLine, tomorrow)
        earliestDateTime = await this.checkForCot(previousSchedule, earliestDateTime, finalGoodId, productionLine)
        
        let endOfDay = new Date(earliestDateTime).setHours(productionLine.endTime, 0, 0)
        let key = dateKey
        while (earliestDateTime >= endOfDay) {
          //since the next earliest date time cant fit into the end of day, check subsequent days until it finds a slot
          const currentDate = this.convertStringToDateFormat(key)
          const nextDay = new Date(currentDate)
          nextDay.setDate(nextDay.getDate() + 1)
          key = this.convertDateToStringFormat(nextDay)
          earliestDateTime = schedulesMap.get(key) ?? nextDay.setHours(productionLine.startTime, 0, 0)
          const previousSchedule = this.getLatestScheduleOfProductionLine(productionLine, nextDay)
          earliestDateTime = await this.checkForCot(previousSchedule, earliestDateTime, finalGoodId, productionLine)
          endOfDay = new Date(earliestDateTime).setHours(productionLine.endTime, 0, 0)
        }
        if (earliestDateTime < nextAvailableNearestDateTime) {
          nextAvailableNearestDateTime = earliestDateTime
          nextAvailableProdLineId = +productionId
        }
      }
      
    }
    return {
      productionLineId: nextAvailableProdLineId,
      nextAvailableNearestDateTime: nextAvailableNearestDateTime
    }

  }

  getLatestScheduleOfProductionLine(productionLine: ProductionLine, dateCheck: Date): Schedule {
    const schedules = productionLine.schedules
    //filter schedules that matches the same date
    const schedulesWithinDay = schedules.filter(schedule => {
      if (new Date(schedule.end).setHours(0,0,0,0) === new Date(dateCheck).setHours(0,0,0,0)) {
        return schedule
      }
    })
    let latestSchedule: Schedule
    if (schedulesWithinDay.length > 0) {
      latestSchedule = schedulesWithinDay.sort(function(a,b) {
        return a.end.getTime() - b.end.getTime()
      })[schedulesWithinDay.length - 1]
    }
    
    return latestSchedule
  }

  async checkForCot(schedule: Schedule, earliestDateTime: number, finalGoodId: number, productionLine: ProductionLine) {
    if (!schedule) {
      return earliestDateTime
    }
    const previousSchedule = await this.scheduleService.findOne(schedule.id)
    const finalGoodProducedBySchedule = previousSchedule.productionOrder.bom.finalGood.id
    //REMOVE THIS (Required for testing)
    //const finalGoodProducedBySchedule = previousSchedule.finalGoodId
    if (finalGoodId === finalGoodProducedBySchedule) {
      return earliestDateTime
    } else {
      //need to add COT to the earliestDateTime
      return earliestDateTime + productionLine.gracePeriod
    }
  }

  async retrieveSchedulesForProductionOrder(quantity: number, finalGoodId: number, daily: boolean, days: number, organisationId: number) {
	const schedules = []
    let mapping =  await this.getNextEarliestMapping(finalGoodId, organisationId)
    if (Object.keys(mapping).length === 0 || quantity === 0) {
      return schedules
    }
    if (daily) {
      let startingDate = new Date()
      for (let i = 0; i < days; i++) {
        const {newSchedules, newMapping} = await this.retrieveSchedulesForAnOrder(mapping, quantity, new Date(startingDate), daily, finalGoodId)
        schedules.push(...newSchedules) 
        mapping = newMapping
        startingDate.setDate(startingDate.getDate() + 1)
      }
    } else {
      const { newSchedules } = await this.retrieveSchedulesForAnOrder(mapping, quantity, new Date(), daily, finalGoodId)
      schedules.push(...newSchedules) 
    }
    schedules.map((value, index) => {
      return value.id = index + 1
    })
    return schedules
  }

  async retrieveSchedulesForAnOrder(mapping: Object, quantity: number, startingDate: Date, daily: boolean, finalGoodId: number) {
    const schedules: Object[] = []
    let requiredQuantity = quantity
    while (requiredQuantity > 0) {
      const nextAvailablePlandTime = await this.getNextAvailableNearestDateTime(mapping, startingDate, finalGoodId)
      const {productionLineId, nextAvailableNearestDateTime} = nextAvailablePlandTime
      const productionLine = await this.findOne(productionLineId)
      const endOfDayOfNextAvailableTime = new Date(nextAvailableNearestDateTime).setHours(productionLine.endTime, 0, 0)
      const timeRequiredInMilliseconds = (requiredQuantity / productionLine.outputPerHour) * 60 * 60 * 1000
      if (daily) {
        const startOfDayInMilliseconds = new Date(endOfDayOfNextAvailableTime).setHours(productionLine.startTime, 0, 0)
        if (timeRequiredInMilliseconds > endOfDayOfNextAvailableTime - startOfDayInMilliseconds) {
          throw new NotFoundException('Quantity Exceeds the daily limit!')
        }
      }
      if (timeRequiredInMilliseconds > endOfDayOfNextAvailableTime - nextAvailableNearestDateTime) {
        //it exceeds the end of day, so have to reduce the requiredQty
        const outputWithinFrame = Math.round((endOfDayOfNextAvailableTime - nextAvailableNearestDateTime) / 3600000 * productionLine.outputPerHour)
        requiredQuantity -= outputWithinFrame

    
        //save this schedule
        schedules.push({
          productionLineId: productionLineId,
          start: new Date(nextAvailableNearestDateTime),
          end: new Date(endOfDayOfNextAvailableTime),
          quantity: outputWithinFrame
        })

        //need to update the mapping
        const keyDateToUpdate = this.convertDateToStringFormat(new Date(nextAvailableNearestDateTime))
        mapping[productionLineId][keyDateToUpdate] = endOfDayOfNextAvailableTime
      } else {
        //if its within the end of day, required Quantity becomes 0
        //save this schedule
        schedules.push({
          productionLineId: productionLineId,
          start: new Date(nextAvailableNearestDateTime),
          end: new Date(nextAvailableNearestDateTime + timeRequiredInMilliseconds),
          quantity: requiredQuantity
        })
        requiredQuantity = 0
        //need to update the mapping
        const keyDateToUpdate = this.convertDateToStringFormat(new Date(nextAvailableNearestDateTime))
        mapping[productionLineId][keyDateToUpdate] = nextAvailableNearestDateTime + timeRequiredInMilliseconds
      }
    }
    return {
      newSchedules: schedules,
      newMapping: mapping
    }
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
