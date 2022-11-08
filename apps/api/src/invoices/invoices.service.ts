import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderStatus } from '../purchase-orders/enums/purchaseOrderStatus.enum';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceStatus } from './enums/invoiceStatus.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @Inject(forwardRef(() => PurchaseOrdersService))
    private purchaseOrdersService: PurchaseOrdersService
  ) {}
  async create(createInvoiceDto: CreateInvoiceDto) {
    try{
      const { amount, poId } = createInvoiceDto
      const poToBeAdded: PurchaseOrder = await this.purchaseOrdersService.findOne(poId)
      const newInvoice: Invoice = this.invoicesRepository.create({
        date: new Date(),
        amount,
        status: InvoiceStatus.PENDING,
        po: poToBeAdded
      })
      return this.invoicesRepository.save(newInvoice)
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
  }

  findAll() {
    return this.invoicesRepository.find({
      relations: {
        po: {
          supplier: true
        }
      }
    })
  }

  findOne(id: number) {
    return this.invoicesRepository.findOne({
      where: {
        id
      }, relations: {
        po: {
          supplier: true
        }
      }
    })
  }

  async findSentInvoicesByOrg(id: number) {
    const purchaseOrders = await this.purchaseOrdersService.findReceivedPurchaseOrderByOrg(id)
    let invoices : Invoice[] = []
    for (const purchaseOrder of purchaseOrders) {
      if (purchaseOrder.invoice) {
        invoices.push(purchaseOrder.invoice)
      }
    }
    return invoices
  }

  async findIncomingInvoicesByOrg(id: number) {
    const purchaseOrders = await this.purchaseOrdersService.findSentPurchaseOrderByOrg(id)
    let invoices : Invoice[] = []
    for (const purchaseOrder of purchaseOrders) {
      if (purchaseOrder.invoice) {
        invoices.push(purchaseOrder.invoice)
      }
    }
    return invoices
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoiceToUpdate = await this.findOne(id)
    const arrayOfKeyValues = Object.entries(updateInvoiceDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      invoiceToUpdate[key] = value
      if (key == 'status' && value == InvoiceStatus.CLOSED) {
        this.purchaseOrdersService.update(invoiceToUpdate.po.id, {status: PurchaseOrderStatus.CLOSED})
        invoiceToUpdate['paymentReceived'] = new Date()
      }
    })
    return this.invoicesRepository.save(invoiceToUpdate)
  }

  async remove(id: number) {
    const invoiceToRemove = await this.findOne(id)
    return this.invoicesRepository.remove(invoiceToRemove)
  }
}
