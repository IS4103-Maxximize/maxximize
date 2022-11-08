import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { getRevenueDto } from './dto/get-revenue.dto';

@Injectable()
export class RevenueService {
  constructor(
    private invoicesService: InvoicesService
  ) {}
  async getRevenueByDate(getRevenueDto: getRevenueDto) {
    const months = ["Jan", "Feb", "Mar", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
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
        const key = `${months[monthOfPayment]}/${yearOfPayment}`
        if (map.has(key)) {
          let {revenue, lineItems} = map.get(key)
          lineItems.push(invoice)
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
          lineItems.push(invoice)
    
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
          console.log(map)
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
}
