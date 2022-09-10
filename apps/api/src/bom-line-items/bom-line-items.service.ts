import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { Product } from '../products/entities/product.entity';
import { CreateBomLineItemDto } from './dto/create-bom-line-item.dto';
import { UpdateBomLineItemDto } from './dto/update-bom-line-item.dto';
import { BomLineItem } from './entities/bom-line-item.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BomLineItemsService {
  constructor(
    @InjectRepository(BillOfMaterial)
    private readonly billOfMaterialRepository: Repository<BillOfMaterial>,
    @InjectRepository(BomLineItem)
    private readonly bomLineItemRepository: Repository<BomLineItem>
  ){}

  async create(createBomLineItemDto: CreateBomLineItemDto): Promise<BomLineItem> {
    const {subTotal, product, billOfMaterial} = createBomLineItemDto
    const newBomLineItem = this.bomLineItemRepository.create({
      subTotal,
      product
    })
    const id = billOfMaterial.id
    const bom = await this.billOfMaterialRepository.findOne({where:{
      id
    }})
    newBomLineItem['billOfMaterial'] = bom

    bom['bomLineItems'].push(newBomLineItem)
    await this.billOfMaterialRepository.save(bom)
    return this.bomLineItemRepository.save(newBomLineItem);
  }

  findAll():Promise<BomLineItem[]> {
    return this.bomLineItemRepository.find({
      relations: {
        billOfMaterial: true
      }
    });
  }

  async findOne(id: number): Promise<BomLineItem> {
    try {
      const bomLineItem =  await this.bomLineItemRepository.findOne({where: {
        id
      }, relations: {
        billOfMaterial: true
      }})
      return bomLineItem
    } catch (err) {
      throw new NotFoundException(`findOne failed as BOM Line Item with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateBomLineItemDto: UpdateBomLineItemDto): Promise<BomLineItem> {
    try {
      const bomLineItem = await this.bomLineItemRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateBomLineItemDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        if (value) {
          if (key === 'subTotal') {
            bomLineItem['subTotal'] = value
          } else if (key === 'product') {
            bomLineItem['product'] = value
          } else {
            bomLineItem[key] = value
          }
        }
      }
      return this.bomLineItemRepository.save(bomLineItem)
    } catch (err) {
      throw new NotFoundException(`update Failed as BOM Line Item with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<BomLineItem> {
    try {
      const bomLineItem = await this.bomLineItemRepository.findOneBy({id})
      return this.bomLineItemRepository.remove(bomLineItem);
    } catch (err) {
      throw new NotFoundException(`Remove failed as BOM Line Item with id: ${id} cannot be found`)
    }
  }
}
