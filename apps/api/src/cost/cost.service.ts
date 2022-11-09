import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { MembershipsService } from '../memberships/memberships.service';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ScheduleType } from '../schedules/enums/scheduleType.enum';
import { SchedulesService } from '../schedules/schedules.service';
import { GetCostDto } from './dto/get-cost.dto';

@Injectable()
export class CostService {
  constructor(
      private invoicesService: InvoicesService,
      private schedulesService: SchedulesService,
      private membershipsService: MembershipsService
  ) {}

  async getCostByDate(getCostDto: GetCostDto) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const {inDate, start, end, type, range, organisationId} = getCostDto

    let inDateValue = inDate ? {
      month: new Date(inDate).getMonth(),
      year: new Date(inDate).getFullYear()
    } : null

    let startValue = start ? {
      month: new Date(start).getMonth(),
      year: new Date(start).getFullYear()
    } : null

    let endValue = end ? {
      month: new Date(end).getMonth(),
      year: new Date(end).getFullYear()
    } : null

    //get all the invoices received
    const allInvoices = await this.invoicesService.findIncomingInvoicesByOrg(organisationId)
    //only use closed invoices
    const closedInvoices = allInvoices.filter(invoice => invoice.status === InvoiceStatus.CLOSED)
    //get all the schedules
    const schedules = await this.schedulesService.findAllByOrg(organisationId)
    //only use completed or allocated schedules
    const completedSchedules = schedules.filter(schedule => {
      return (schedule.status === ScheduleType.ALLOCATED || schedule.status === ScheduleType.COMPLETED)
    })
    //get all invoices paid to maxximize
    const membership = await this.membershipsService.findOneByOrg(organisationId)
    const {customerId} = membership
    const invoices = await this.membershipsService.getInvoicesOfCustomer(customerId)
    //only use paid invoices
    const paidInvoicesToMaxximize = invoices.filter(invoice => invoice.status === 'paid')

    let map = new Map()
    let filteredInvoices: Invoice[]
    let filteredSchedules:  Schedule[]
    let filteredMaxximizeInvoices: any[]

    filteredInvoices = this.filterObjectsByDateInputs(inDateValue, startValue, endValue, closedInvoices, type, range, 'invoice')
    filteredSchedules = this.filterObjectsByDateInputs(inDateValue, startValue, endValue, completedSchedules, type, range, 'schedule')
    filteredMaxximizeInvoices = this.filterObjectsByDateInputs(inDateValue, startValue, endValue, paidInvoicesToMaxximize, type, range, 'maxximizeInvoice')
    
    map = this.setMapping(map, filteredInvoices, 'invoice', type)
    map = this.setMapping(map, filteredSchedules, 'schedule', type)
    map = this.setMapping(map, filteredMaxximizeInvoices, 'maxximizeInvoice', type)

    //need to convert map to object
    const arrayOfCosts = Array.from(map, ([key, value]) => {
      return {
        dateKey: key,
        cost: Math.round(value.cost * 100) / 100,
        lineItems: value.lineItems
      }
    })
    return arrayOfCosts
  }

  getCostAmount(objectType: string, object: any) {
    let amount: number
    if (objectType === 'invoice') {
      amount = object.amount
    } else if (objectType === 'maxximizeInvoice') {
      amount = object.total
    } else if (objectType === 'schedule') {
      //need to get the schedule end and start time
      //need to get the schedule production line
      //calculate cost
      const {end, start, productionLine} = object
      const timeFrame = new Date(end).getTime() - new Date(start).getTime()
      const timeFrameInHours = timeFrame / 1000 / 60 / 60
      amount = timeFrameInHours * productionLine.productionCostPerLot
    }
    return amount
  }

  setMapping(map: Map<string, any>, lineItems: any[], objectType: string, type: string) {
    let dateProperty: string
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    if (objectType === 'invoice') {
      dateProperty = 'paymentReceived'
    } else if (objectType === 'schedule') {
      dateProperty = 'end'
    } else if (objectType === 'maxximizeInvoice') {
      dateProperty = 'created'
    }

    for (const lineItem of lineItems) {
      const monthOfPayment = new Date(lineItem[dateProperty]).getMonth()
      const yearOfPayment = new Date(lineItem[dateProperty]).getFullYear()
      const key = type === 'month' ? `${months[monthOfPayment]}/${yearOfPayment}` : `${yearOfPayment}`
      if (map.has(key)) {
        let {cost, lineItems} = map.get(key)
        lineItems.push({...lineItem, type: objectType, costAmount: this.getCostAmount(objectType, lineItem)})
  
        map.set(key, {
          cost: cost += this.getCostAmount(objectType, lineItem),
          lineItems
        })
      } else {
        const value = {
          cost: this.getCostAmount(objectType, lineItem),
          lineItems: [{...lineItem, type: objectType, costAmount: this.getCostAmount(objectType, lineItem)}]
        }
        map.set(key, value)
      }
    }
    return map
  }

  filterObjectsByDateInputs(inDateValue: any, startValue: any, endValue: any, objects: any[], type: string, range: boolean, objectType: any) {
    let filteredObjects: any[]
    let dateProperty: string
    if (objectType === 'invoice') {
      dateProperty = 'paymentReceived'
    } else if (objectType === 'schedule') {
      dateProperty = 'end'
    } else if (objectType === 'maxximizeInvoice') {
      dateProperty = 'created'
    }
    if (type === 'month') {
      if (!range) {
        filteredObjects = objects.filter(object => {
          const dateOfCostIncurred = new Date(object[dateProperty])
          const {month, year} = inDateValue
          return (dateOfCostIncurred.getMonth() === month && 
          dateOfCostIncurred.getFullYear() === year)
        })
      } else {
        filteredObjects = objects.filter(object => {
          const dateOfCostIncurred = new Date(object[dateProperty])
          const costMonth = dateOfCostIncurred.getMonth()
          const costYear = dateOfCostIncurred.getFullYear()
          const {month: startMonth, year: startYear} = startValue
          const {month: endMonth, year: endYear} = endValue
          let check = false
          if ((costMonth >= startMonth && 
            costMonth <= endMonth) && 
            (costYear >= startYear && 
              costYear <= endYear)) {
              check = true
          }
          return check
        })
      }
    } else {
      if (!range) {
        filteredObjects = objects.filter(object => {
          const dateOfCostIncurred = new Date(object[dateProperty])
          const {year} = inDateValue
          return dateOfCostIncurred.getFullYear() === year
        })
      } else {
        filteredObjects = objects.filter(object => {
          const dateOfCostIncurred = new Date(object[dateProperty])
          const costYear = dateOfCostIncurred.getFullYear()
          const {year: startYear} = startValue
          const {year: endYear} = endValue
          let check = false
          if ((costYear >= startYear && 
              costYear <= endYear)) {
              check = true
          }
          return check
        })
      }
    }
    return filteredObjects
  }
}
