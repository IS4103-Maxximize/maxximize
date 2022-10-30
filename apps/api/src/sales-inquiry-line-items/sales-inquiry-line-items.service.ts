/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { CreateSalesInquiryLineItemDto } from './dto/create-sales-inquiry-line-item.dto';
import { UpdateSalesInquiryLineItemDto } from './dto/update-sales-inquiry-line-item.dto';
import { SalesInquiryLineItem } from './entities/sales-inquiry-line-item.entity';

@Injectable()
export class SalesInquiryLineItemsService {
  constructor(
    @InjectRepository(SalesInquiryLineItem)
    private readonly salesInquiryLineItemsRepository: Repository<SalesInquiryLineItem>,
    @InjectRepository(SalesInquiry)
    private readonly salesInquiriesRepository: Repository<SalesInquiry>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>,
    private finalGoodService: FinalGoodsService
  ) {}

  async create(
    createSalesInquiryLineItemDto: CreateSalesInquiryLineItemDto
  ): Promise<SalesInquiryLineItem> {
    try {
      const { quantity, indicativePrice, rawMaterialId, finalGoodId } =
        createSalesInquiryLineItemDto;
      let rawMaterialToBeAdded: RawMaterial;
      let finalGoodToBeAdded: FinalGood
      rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({
        id: rawMaterialId,
      });
      finalGoodToBeAdded = await this.finalGoodService.findOne(finalGoodId)
      const newSalesInquiryLineItem =
        this.salesInquiryLineItemsRepository.create({
          quantity,
          indicativePrice,
          rawMaterial: rawMaterialToBeAdded,
          finalGood: finalGoodToBeAdded
        });
      return this.salesInquiryLineItemsRepository.save(newSalesInquiryLineItem);
    } catch (error) {
      throw new NotFoundException('The Entity cannot be found');
    }
  }

  findAll(): Promise<SalesInquiryLineItem[]> {
    return this.salesInquiryLineItemsRepository.find({
      relations: {
        rawMaterial: true,
        salesInquiry: true,
        finalGood: true
      },
    });
  }

  findOne(id: number): Promise<SalesInquiryLineItem> {
    return this.salesInquiryLineItemsRepository.findOne({
      where: {
        id,
      },
      relations: {
        rawMaterial: true,
        salesInquiry: true,
        finalGood: true
      },
    });
  }

  async update(
    id: number,
    updateSalesInquiryLineItemDto: UpdateSalesInquiryLineItemDto
  ): Promise<SalesInquiryLineItem> {
    try {
      const salesInquiryLineItemToUpdate =
      await this.salesInquiryLineItemsRepository.findOneByOrFail({ id });
      const arrayOfKeyValues = Object.entries(updateSalesInquiryLineItemDto);
      arrayOfKeyValues.forEach(([key, value]) => {
        salesInquiryLineItemToUpdate[key] = value;
      });
      return this.salesInquiryLineItemsRepository.save(
        salesInquiryLineItemToUpdate
      );
    } catch(error) {
      throw new NotFoundException(`sales Inquiry Line item with id:${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<SalesInquiryLineItem> {
    let salesInquiryLineItem: SalesInquiryLineItem;
    salesInquiryLineItem = await this.findOne(id);
    let salesInquiry: SalesInquiry;
    salesInquiry = await this.salesInquiriesRepository.findOneByOrFail({
      id: salesInquiryLineItem.salesInquiry.id,
    });
    const salesInquiryLineItemToRemove =
      await this.salesInquiryLineItemsRepository.findOneBy({ id });
    salesInquiry.totalPrice -=
      salesInquiryLineItem.indicativePrice * salesInquiryLineItem.quantity;
    this.salesInquiriesRepository.save(salesInquiry);
    return this.salesInquiryLineItemsRepository.remove(
      salesInquiryLineItemToRemove
    );
  }
}
