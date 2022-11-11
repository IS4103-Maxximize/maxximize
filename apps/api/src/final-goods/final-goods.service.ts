/* eslint-disable prefer-const */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '../invoices/enums/invoiceStatus.enum';
import { InvoicesService } from '../invoices/invoices.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';
import { FinalGood } from './entities/final-good.entity';

@Injectable()
export class FinalGoodsService {
  constructor(
    @InjectRepository(FinalGood)
    private readonly finalGoodRepository: Repository<FinalGood>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService
  ){}

  async create(createFinalGoodDto: CreateFinalGoodDto): Promise<FinalGood> {
    const {name, description, unit, unitPrice, expiry, lotQuantity, organisationId} = createFinalGoodDto
    let organisationToBeAdded: Organisation
    organisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: organisationId})
    const newFinalGoodInstance = this.finalGoodRepository.create({
      name,
      description,
      unit,
      unitPrice,
      expiry,
      lotQuantity,
      organisation: organisationToBeAdded
    });
    const newFinalGood = await this.finalGoodRepository.save(newFinalGoodInstance);
    const skuCode = `${newFinalGood.id}-${name.toUpperCase().substring(0, 3)}`;
    return this.update(newFinalGood.id, { skuCode: skuCode });
  }

  findAll(): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({relations: {
      organisation: true,
      billOfMaterial: true,
      image: true
    }})
  }

  async findAllByOrg(organisationId: number): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({
      where: {
        organisation: {
          id: organisationId
        }
      },
      relations: {
        organisation: true,
        billOfMaterial: true,
        image: true
      }
    })
  }

  async findOne(id: number): Promise<FinalGood> {
    try {
      const finalGood =  await this.finalGoodRepository.findOneOrFail({where: {
        id
      }, relations: {
        organisation: true,
        billOfMaterial: true,
        image: true
      }})
      return finalGood
    } catch (err) {
      throw new NotFoundException(`findOne failed as Final Good with id: ${id} cannot be found`)
    }
  }

  async findTopSellingGoods(orgId: number){
    const invoices = await this.invoicesService.findSentInvoicesByOrg(orgId)
    const goodsSales = new Map<number, number>()
    const date = new Date()
    for (const invoice of invoices) {
      if (invoice.status == InvoiceStatus.CLOSED){
        const po = (await this.invoicesService.findOne(invoice.id)).po
        if (invoice.paymentReceived.getMonth() == date.getMonth() && invoice.paymentReceived.getFullYear() == date.getFullYear()){
          for (const poLineItem of po.poLineItems) {
            if(goodsSales.has(poLineItem.finalGood.id)) {
              const quantity = goodsSales.get(poLineItem.finalGood.id) + poLineItem.quantity
              goodsSales.set(poLineItem.finalGood.id, quantity)
            } else {
              goodsSales.set(poLineItem.finalGood.id, poLineItem.quantity)
            }
          }
        }
      }
    }
    const mapSort1 = new Map([...goodsSales.entries()].sort((a, b) => b[1] - a[1]))
    const finalGoods = [...mapSort1.keys()]
    let i = 0
    const arr = []
    while (mapSort1.has(finalGoods[i]) && i<5){
      arr.push({name: (await this.findOne(finalGoods[i])).name, quantity: mapSort1.get(finalGoods[i])})
      i++
    }
    // const arr = [
    //   {name: (await this.findOne(finalGoods[0])).name, quantity: mapSort1.get(finalGoods[0])},
    //   {name: (await this.findOne(finalGoods[1])).name, quantity: mapSort1.get(finalGoods[1])},
    //   {name: (await this.findOne(finalGoods[2])).name, quantity: mapSort1.get(finalGoods[2])},
    //   {name: (await this.findOne(finalGoods[3])).name, quantity: mapSort1.get(finalGoods[3])},
    //   {name: (await this.findOne(finalGoods[4])).name, quantity: mapSort1.get(finalGoods[4])}
    // ]

    return arr
  }

  async update(id: number, updateFinalGoodDto: UpdateFinalGoodDto): Promise<FinalGood> {
    try {
      const product = await this.finalGoodRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateFinalGoodDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        if (value) {
            if (key === 'description') {
              product.description = value;
            }
            else if (key === 'unitPrice') {
              product.unitPrice = value;
            }
            else if (key === 'expiry') {
              product.expiry = value;
            } 
            else if (key === 'skuCode') {
              product.skuCode = value;
            } 
            else if (key === 'lotQuantity') {
              product.lotQuantity = value;
            } 
          } 
        else {
          product[key] = value
        }
      }
      await this.finalGoodRepository.save(product);
      return this.findOne(id);
    } catch (err) {
      throw new NotFoundException(`update Failed as Final Good with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<FinalGood> {
    try {
      const product = await this.finalGoodRepository.findOneBy({id})
      return this.finalGoodRepository.remove(product);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Final Good with id: ${id} cannot be found`)
    }
  }
}
