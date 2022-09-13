import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { CreateQuotationLineItemDto } from './dto/create-quotation-line-item.dto';
import { UpdateQuotationLineItemDto } from './dto/update-quotation-line-item.dto';
import { QuotationLineItem } from './entities/quotation-line-item.entity';

@Injectable()
export class QuotationLineItemsService {
  constructor(
    @InjectRepository(QuotationLineItem)
    private readonly quotationLineItemsRepository: Repository<QuotationLineItem>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    @InjectRepository(FinalGood)
    private readonly finalGoodsRepository: Repository<FinalGood>,
  ){}

  async create(createQuotationLineItemDto: CreateQuotationLineItemDto): Promise<QuotationLineItem> {
    try {
      const { quantity, price, unit, rawMaterial, finalGood, quotation} = createQuotationLineItemDto
      let rawMaterialToBeAdded: RawMaterial
      let finalGoodToBeAdded: FinalGood
      let quotationToBeAdded: Quotation
      rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterial.id})
      if (finalGood) {
        finalGoodToBeAdded = await this.finalGoodsRepository.findOneByOrFail({id: finalGood.id})
      } else {
        finalGoodToBeAdded = null
      }
      quotationToBeAdded = await this.quotationsRepository.findOneByOrFail({id: quotation.id})
      const newQuotationLineItem = this.quotationLineItemsRepository.create({
        quantity,
        price,
        unit,
        rawMaterial: rawMaterialToBeAdded,
        finalGood: finalGoodToBeAdded,
        quotation: quotationToBeAdded
      })
      return this.quotationLineItemsRepository.save(newQuotationLineItem)
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
  }

  findAll(): Promise<QuotationLineItem[]> {
    return this.quotationLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        quotation: true
      }
    })
  }

  findOne(id: number): Promise<QuotationLineItem> {
    return this.quotationLineItemsRepository.findOne({where: {
      id
    }, relations: {
      rawMaterial: true,
      quotation: true
    }})
  }

  async update(id: number, updateQuotationLineItemDto: UpdateQuotationLineItemDto): Promise<QuotationLineItem> {
    const quotationLineItemToUpdate = await this.quotationLineItemsRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateQuotationLineItemDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      quotationLineItemToUpdate[key] = value
    })
    return this.quotationLineItemsRepository.save(quotationLineItemToUpdate)
  }

  async remove(id: number): Promise<QuotationLineItem> {
    const quotationLineItemToRemove = await this.quotationLineItemsRepository.findOneBy({id})
    return this.quotationLineItemsRepository.remove(quotationLineItemToRemove)
  }
}
