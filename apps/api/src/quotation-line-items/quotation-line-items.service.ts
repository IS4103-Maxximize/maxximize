/* eslint-disable prefer-const */
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
      const { quantity, price, rawMaterialId, finalGoodId, quotationId } = createQuotationLineItemDto
      let rawMaterialToBeAdded: RawMaterial
      let finalGoodToBeAdded: FinalGood
      let quotationToBeAdded: Quotation
      rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterialId})
      if (finalGoodId) {
        finalGoodToBeAdded = await this.finalGoodsRepository.findOneByOrFail({id: finalGoodId})
      } else {
        finalGoodToBeAdded = null
      }
      quotationToBeAdded = await this.quotationsRepository.findOneByOrFail({id: quotationId})
      const newQuotationLineItem = this.quotationLineItemsRepository.create({
        quantity,
        price,
        rawMaterial: rawMaterialToBeAdded,
        finalGood: finalGoodToBeAdded,
        quotation: quotationToBeAdded
      })
      quotationToBeAdded.totalPrice += price*quantity
      this.quotationsRepository.save(quotationToBeAdded)
      return this.quotationLineItemsRepository.save(newQuotationLineItem)
    } catch (error) {
      throw new NotFoundException('The quotation cannot be found')
    }
  }

  findAll(): Promise<QuotationLineItem[]> {
    return this.quotationLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        quotation: true,
      }
    })
  }

  async findOne(id: number): Promise<QuotationLineItem> {
    try {
      return await this.quotationLineItemsRepository.findOne({where: {
        id
      }, relations: {
        rawMaterial: true,
        quotation: true
      }})
    } catch (err) {
      throw new NotFoundException('The quotation line item cannot be found')
    }
    
  }

  async update(id: number, updateQuotationLineItemDto: UpdateQuotationLineItemDto): Promise<QuotationLineItem> {
    try{
      const quotationLineItemToUpdate = await this.quotationLineItemsRepository.findOneBy({id})
      const arrayOfKeyValues = Object.entries(updateQuotationLineItemDto)
      arrayOfKeyValues.forEach(([key, value]) => {
        quotationLineItemToUpdate[key] = value
      })
      return this.quotationLineItemsRepository.save(quotationLineItemToUpdate)
    } catch (err) {
      throw new NotFoundException('The quotation line item cannot be found')
    }
    
  }

  async remove(id: number): Promise<QuotationLineItem> {
    try {
      const quotationLineItemToRemove = await this.quotationLineItemsRepository.findOneBy({id})
      return this.quotationLineItemsRepository.remove(quotationLineItemToRemove)
    } catch (err) {
      throw new NotFoundException('The quotation line item cannot be found')
    }
    
  }
}
