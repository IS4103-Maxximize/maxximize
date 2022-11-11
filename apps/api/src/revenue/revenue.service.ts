import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { GetRevenueDto } from './dto/get-revenue.dto';
import Stripe from 'stripe';
import { RevenueCommisionDto } from './dto/revenue-commision.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { OrganisationsService } from '../organisations/organisations.service';
import { RevenueBracketsService } from '../revenue-brackets/revenue-brackets.service';
import { GetContributorsDto } from './dto/get-contributors.dto';
import { GetSalesAmountDto } from './dto/get-sales-amount.dto';

@Injectable()
export class RevenueService implements OnModuleInit {
  private readonly logger = new Logger(RevenueService.name);
  private months = [
    "January", "February", "March", 
    "April", "May", "June", 
    "July", "August", "September", 
    "October", "November", "December"
  ]
  private stripe: Stripe
  constructor(
    private invoicesService: InvoicesService,
    private schedulerRegistry: SchedulerRegistry,
    private organisationService: OrganisationsService,
    private revenueBracketService: RevenueBracketsService
  ) {
    this.stripe = new Stripe(process.env.API_SECRET_KEY, {
      apiVersion: '2022-08-01'
    })
  }
  async getRevenueByDate(getRevenueDto: GetRevenueDto) {
    const {inDate, start, end, type, range, organisationId} = getRevenueDto
    
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

    const allInvoices = await this.invoicesService.findSentInvoicesByOrg(organisationId)
    //const need to get invoices that are closed
    const closedInvoices = allInvoices.filter(invoice => invoice.status === InvoiceStatus.CLOSED)

    //create a map, key and values will be created along the way
    const map = new Map()
    //check if the type is month or year
    //month
    let filteredInvoices: Invoice[]
    if (type === 'month') {
      //inDate
      if (!range) {
        filteredInvoices = closedInvoices.filter(invoice => {
          const dateOfPaymentReceived = new Date(invoice.paymentReceived)
          const {month, year} = inDateValue
          return (dateOfPaymentReceived.getMonth() === month && 
          dateOfPaymentReceived.getFullYear() === year)
        })
      } else {
        //range
        filteredInvoices = closedInvoices.filter(invoice => {
          const dateOfPaymentReceived = new Date(invoice.paymentReceived)
          const paymentMonth = dateOfPaymentReceived.getMonth()
          const paymentYear = dateOfPaymentReceived.getFullYear()
          const {month: startMonth, year: startYear} = startValue
          const {month: endMonth, year: endYear} = endValue
          let check = false
          if ((paymentMonth >= startMonth && 
            paymentMonth <= endMonth) && 
            (paymentYear >= startYear && 
              paymentYear <= endYear)) {
              check = true
          }
          return check
        })
      }
      //mapping for month type
      for (const invoice of filteredInvoices) {
        const monthOfPayment = new Date(invoice.paymentReceived).getMonth()
        const yearOfPayment = new Date(invoice.paymentReceived).getFullYear()
        const key = `${this.months[monthOfPayment]}/${yearOfPayment}`
        if (map.has(key)) {
          let {revenue, lineItems} = map.get(key)
          lineItems.push({...invoice, type: 'invoice'})
          map.set(key, {
            revenue: revenue += invoice.amount,
            lineItems: lineItems
          })
        } else {
          const value = {
            revenue: invoice.amount,
            lineItems: [{...invoice, type: 'invoice'}]
          }
          map.set(key, value)
        }
      }
    } else {
      //type is 'year' means focusing on the year aspect of date input
      if (!range) {
        //inDate
        filteredInvoices = closedInvoices.filter(invoice => {
          const dateOfPaymentReceived = new Date(invoice.paymentReceived)
          const {year} = inDateValue
          return dateOfPaymentReceived.getFullYear() === year
        })
      } else {
        //range
        filteredInvoices = closedInvoices.filter(invoice => {
          const dateOfPaymentReceived = new Date(invoice.paymentReceived)
          const paymentYear = dateOfPaymentReceived.getFullYear()
          const {year: startYear} = startValue
          const {year: endYear} = endValue
          let check = false
          if ((paymentYear >= startYear && 
              paymentYear <= endYear)) {
              check = true
          }
          return check
        })
      }
      //mapping for month type
      for (const invoice of filteredInvoices) {
        const yearOfPayment = new Date(invoice.paymentReceived).getFullYear()
        const key = `${yearOfPayment}`
        if (map.has(key)) {
          let {revenue, lineItems} = map.get(key)
          lineItems.push({...invoice, type: 'invoice'})
    
          map.set(key, {
            revenue: revenue += invoice.amount,
            lineItems
          })
        } else {
          const value = {
            revenue: invoice.amount,
            lineItems: [{...invoice, type: 'invoice'}]
          }
          map.set(key, value)
        }
      }
    }
    //need to convert map to object
    const arrayOfRevenues = Array.from(map, ([key, value]) => {
      return {
        dateKey: key,
        revenue: value.revenue,
        lineItems: value.lineItems
      }
    })
    return arrayOfRevenues
  }

  async paymentToStripe(revenueCommisionDto: RevenueCommisionDto) {
    const {customerId, amount, paymentMethod, currency, description} = revenueCommisionDto
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      default_payment_method: paymentMethod,
      description
    })
    await this.stripe.invoiceItems.create({
      customer: customerId,
      amount,
      currency,
      invoice: invoice.id,
    })
    const paidInvoice = await this.stripe.invoices.pay(
      invoice.id
    )
    return paidInvoice
  }

  async onModuleInit() {
    await this.setUpPaymentsForCommisionCollection()
  }

  async calculateCommisionForMonth(date: Date, organisationId: number) {
    const getRevenueDto: GetRevenueDto = {
      inDate: date,
      start: null,
      end: null,
      range: false,
      type: 'month',
      organisationId
    }
    const revenueArray = await this.getRevenueByDate(getRevenueDto)
    if (revenueArray.length > 0) {
      const lineItem = revenueArray[0]
      const grossRevenueAmount = lineItem.revenue
      const bracket = await this.getRevenueBracket(grossRevenueAmount)
      if (bracket) {
        const percentage = bracket.commisionRate
        const paymentAmount = Math.round((percentage / 100) * grossRevenueAmount)
        return paymentAmount
      }
    }
    return 0
  }

  async getRevenueBracket(amount: number) {
    const revenueBrackets = await this.revenueBracketService.findAll()
    const bracket = revenueBrackets.find(bracket => {
      const {start, end} = bracket
      if (start && end) {
        if (amount > start && amount <= end) {
          return bracket
        }
      } else if (start && !end) {
        if (amount > start) {
          return bracket
        }
      }
    })
    return bracket
  }

  async setUpPayments() {
    //get all organisation which are customers and charge them for commision
    const currentDate = new Date()
    const previousMonth = currentDate.setMonth(currentDate.getMonth() - 1)
    const previousMonthDate = new Date(previousMonth)
    const organisations = await this.organisationService.findAll()
    const customers = organisations.filter(organisation => {
      if (organisation.membership && organisation.membership.customerId) {
        return true
      }
    })
    for (const customer of customers) {
      const getRevenueDto: GetRevenueDto = {
        inDate: previousMonthDate,
        start: null,
        end: null,
        range: false,
        type: 'month',
        organisationId: customer.id

      }
      const revenueArray = await this.getRevenueByDate(getRevenueDto)
      if (revenueArray.length > 0) {
        const lineItem = revenueArray[0]
        const grossRevenueAmount = lineItem.revenue
        const bracket = await this.getRevenueBracket(grossRevenueAmount)
        if (bracket) {
          //fits within a bracket
          const percentage = bracket.commisionRate
          const paymentAmount = Math.round((percentage / 100) * grossRevenueAmount)
          const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
          const revenueCommisionDto = {
            amount: paymentAmount * 100,
            customerId: customer.membership.customerId,
            paymentMethod: customer.membership.commisionPayment,
            currency: 'sgd',
            description: `this is the commision paid for month: ${months[previousMonthDate.getMonth()]}/${previousMonthDate.getFullYear()}`
          }
          //make payment to stripe!
          await this.paymentToStripe(revenueCommisionDto)
        }
      }
    }
  }

  async setUpPaymentsForCommisionCollection() {
    const job = new CronJob('0 0 0 1 * *', async () => {
      this.logger.warn("PAYMENT DUE!")
      await this.setUpPayments()
    })
    this.schedulerRegistry.addCronJob("Monthy-Commision", job)
    job.start()
  }

  async getContributorsForRevenue(getContributorsDto: GetContributorsDto) {
    const {count, ...rest} = getContributorsDto
    const getRevenueDto = {
      ...rest
    }
    const revenueArray = await this.getRevenueByDate(getRevenueDto)
    if (revenueArray.length === 0) {
      return []
    } else {
      const {revenue, lineItems}= revenueArray[0]
      const map = new Map()
      for (const lineItem of lineItems) {
        //each line item represent an invoice object with a PO
        const {po} = lineItem
        const supplierKey = po.currentOrganisation.id
        if (!map.has(supplierKey)) {
          const value = {
            name: po.currentOrganisation.name,
            contribution: lineItem.amount
          }
          map.set(supplierKey, value)
        } else {
          const currentValue = map.get(supplierKey)
          const newContribution = currentValue.contribution += lineItem.amount
          const newValue = {
            ...currentValue,
            contribution: newContribution
          }
          map.set(supplierKey, newValue)
        }
      }
      //convert map to array of values
      const allValues = Array.from(map.values())
      const sortedValues = allValues.sort((x, y) => {
        return (y.contribution - x.contribution)
      })
      const ranked = sortedValues.splice(0, count)
      return ranked
    }
  }

  async getSalesAmount(getSalesAmountDto: GetSalesAmountDto) {
    const {currentDate, days, organisationId} = getSalesAmountDto
    const currentDateValue = {
      month: new Date(currentDate).getMonth(),
      year: new Date(currentDate).getFullYear()
    }
    const cloneDate = new Date(currentDate)
    const earliestDate = new Date(cloneDate.setDate(cloneDate.getDate() - (days - 1)))
    const earliestDateValue = {
      month: earliestDate.getMonth(),
      year: earliestDate.getFullYear()
    }

    const {month: latestMonth, year: latestYear} = currentDateValue
    const {month: earliestMonth, year: earliestYear} = earliestDateValue
    //get invoices for same month same year
    //get invoices for same month previous year
    const allSentInvoices = await this.invoicesService.findSentInvoicesByOrg(organisationId)
    const currentMonthInvoices = allSentInvoices.filter(invoice => {
      const invoiceDate = invoice.paymentReceived
      const paymentMonth = invoiceDate.getMonth()
      const paymentYear = invoiceDate.getFullYear()
      return (((paymentMonth >= earliestMonth && 
        paymentMonth <= latestMonth) && 
        (paymentYear >= earliestYear && 
          paymentYear <= latestYear)))
    })
    const previousYearButSameMonthInvoices = allSentInvoices.filter(invoice => {
      const invoiceDate = invoice.paymentReceived
      const paymentMonth = invoiceDate.getMonth()
      const paymentYear = invoiceDate.getFullYear()
      return (((paymentMonth >= earliestMonth && 
        paymentMonth <= latestMonth) && 
        (paymentYear >= earliestYear - 1 && 
          paymentYear <= latestYear - 1)))
    })
    let date = new Date(currentDate)
    const arrayOfSales = []
    for(let i = 0; i < days; i++) {
      const dateValue = {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      }
      const {day, month, year} = dateValue
      const dateKey = `${day}/${month + 1}`
      const currentYearInvoicesThatMatchDate = currentMonthInvoices.
      filter(invoice => (invoice.paymentReceived.getDate() === day &&
      invoice.paymentReceived.getMonth() === month && 
      invoice.paymentReceived.getFullYear() === year))
      let salesAmountThisYear = 0
      for (const invoice of currentYearInvoicesThatMatchDate) {
        salesAmountThisYear += invoice.amount
      }
      const previousYearInvoicesThatMatchDate = previousYearButSameMonthInvoices.filter(invoice => 
        (invoice.paymentReceived.getDate() === day &&
      invoice.paymentReceived.getMonth() === month && 
      invoice.paymentReceived.getFullYear() === year - 1))
      let salesAmountLastYear = 0
      for (const invoice of previousYearInvoicesThatMatchDate) {
        salesAmountLastYear += invoice.amount
      }
      const object = {
        dateKey,
        salesAmountThisYear,
        salesAmountLastYear
      }
      arrayOfSales.push(object)
      date = new Date(date.setDate(date.getDate() - 1))
    }
    return arrayOfSales
    
  }
}
