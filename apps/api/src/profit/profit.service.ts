import { Injectable } from '@nestjs/common';
import { CostService } from '../cost/cost.service';
import { GetCostDto } from '../cost/dto/get-cost.dto';
import { GetRevenueDto } from '../revenue/dto/get-revenue.dto';
import { RevenueService } from '../revenue/revenue.service';
import { GetProfitDto } from './dto/get-profit.dto';

@Injectable()
export class ProfitService {
  private months = [
    "January", "February", "March", 
    "April", "May", "June", 
    "July", "August", "September", 
    "October", "November", "December"
  ]
  constructor(
      private revenueService: RevenueService,
      private costService: CostService,
  ) {}

    async getProfitByDate(getProfitDto: GetProfitDto) {
      const {inDate, start, end, type, range, organisationId} = getProfitDto
      
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
     
      const getRevenueByDate: GetRevenueDto = {
        ...getProfitDto
      }
      
      const getCostByDate: GetCostDto = {
        ...getProfitDto
      }
      const revenueObjectArray = await this.revenueService.getRevenueByDate(getRevenueByDate)
      const costObjectArray = await this.costService.getCostByDate(getCostByDate)

      if (!range) {
        //use inDate as reference
        const value = this.generateInDateProfitLineItems(type, revenueObjectArray, costObjectArray, inDateValue)
        return [value]
      } else {
        //use start and end as reference
        return this.generateRangeProfitLineItems(type, revenueObjectArray, costObjectArray, startValue, endValue)
      }
    }

    generateInDateProfitLineItems(type: string, revenueObjectArray: any[], costObjectArray: any[], inDateValue: any) {
      const revenue = revenueObjectArray.length > 0 ? revenueObjectArray[0].revenue : 0
      const revenueLineItems = revenueObjectArray.length > 0 ? revenueObjectArray[0].lineItems : []
      const cost = costObjectArray.length > 0 ? costObjectArray[0].cost : 0
      const costLineItems = costObjectArray.length > 0 ? costObjectArray[0].lineItems : []
      const profit =  Math.round((revenue - cost) * 100) / 100
      let dateKey: string
      if (type === 'month') {
        dateKey = `${this.months[inDateValue.month]}/${inDateValue.year}`
      } else {
        dateKey = `${inDateValue.year}`
      }
      const value = {
        dateKey,
        profit,
        revenueLineItems: [...revenueLineItems],
        costLineItems: [...costLineItems]
      }
      return value
    }

    generateRangeProfitLineItems(type: string, revenueObjectArray: any[], costObjectArray: any[], startValue: any, endValue: any) {
      const profitArray = []
      const start = new Date(new Date().setMonth(startValue.month))
      start.setFullYear(startValue.year)
      let {month: startMonth, year: startYear} = startValue
      let {month: endMonth, year: endYear} = endValue
      let dateKeyToCheck: string
      if (type === 'month') {
        while ((startMonth <= endMonth && startYear === endYear) || startYear < endYear) {
          dateKeyToCheck = `${this.months[startMonth]}/${startYear}`
          const revenueObject = revenueObjectArray.find(revenueObject => revenueObject.dateKey === dateKeyToCheck)
          const costObject = costObjectArray.find(costObject => costObject.dateKey === dateKeyToCheck)
          const revenue = revenueObject ? revenueObject.revenue : 0
          const cost = costObject ? costObject.cost : 0
          const profit =  Math.round((revenue - cost) * 100) / 100
          const profitObject = {
            dateKey: dateKeyToCheck,
            profit,
            revenueLineItems: revenueObject ? revenueObject.lineItems : [],
            costLineItems: costObject ? costObject.lineItems : []
          }
          profitArray.push(profitObject)
          const newStart = new Date(start.setMonth(start.getMonth() + 1))
          startMonth = newStart.getMonth()
          startYear = newStart.getFullYear()
        }
      } else {
        while(startYear <= endYear) {
          dateKeyToCheck = `${startYear}`
          const revenueObject = revenueObjectArray.find(revenueObject => revenueObject.dateKey === dateKeyToCheck)
          const costObject = costObjectArray.find(costObject => costObject.dateKey === dateKeyToCheck)
          const revenue = revenueObject ? revenueObject.revenue : 0
          const cost = costObject ? costObject.cost : 0
          const profit =  Math.round((revenue - cost) * 100) / 100
          const profitObject = {
            dateKey: dateKeyToCheck,
            profit,
            revenueLineItems: revenueObject ? revenueObject.lineItems : [],
            costLineItems: costObject ? costObject.lineItems : []
          }
          profitArray.push(profitObject)
          const newStart = new Date(start.setFullYear(start.getFullYear() + 1))
          startYear = newStart.getFullYear()
        }
      }
      return profitArray
    }
}
