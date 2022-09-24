import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { Product } from '../products/entities/product.entity';
import { CreateBomLineItemDto } from './dto/create-bom-line-item.dto';
import { UpdateBomLineItemDto } from './dto/update-bom-line-item.dto';
import { BomLineItem } from './entities/bom-line-item.entity';
import { NotFoundException } from '@nestjs/common';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Injectable()
export class BomLineItemsService {
  constructor(
    @InjectRepository(BillOfMaterial)
    private readonly billOfMaterialRepository: Repository<BillOfMaterial>,
    @InjectRepository(BomLineItem)
    private readonly bomLineItemRepository: Repository<BomLineItem>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialsRepository: Repository<RawMaterial>
  ){}

  async create(createBomLineItemDto: CreateBomLineItemDto): Promise<BomLineItem> {
    const {quantity, rawMaterialId, billOfMaterialId} = createBomLineItemDto

    let rawMaterialToBeAdded: RawMaterial
    let billOfMaterialToBeAdded: BillOfMaterial
    rawMaterialToBeAdded = await this.rawMaterialsRepository.findOneByOrFail({id: rawMaterialId})
    if (billOfMaterialId){
      billOfMaterialToBeAdded = await this.billOfMaterialRepository.findOneByOrFail({id: billOfMaterialId})
    }
    const newBomLineItem = this.bomLineItemRepository.create({
      quantity,
      rawMaterial: rawMaterialToBeAdded,
      billOfMaterial: billOfMaterialToBeAdded
    })
    return this.bomLineItemRepository.save(newBomLineItem);
  }

  findAll():Promise<BomLineItem[]> {
    return this.bomLineItemRepository.find({
      relations: {
        rawMaterial: true,
        billOfMaterial: true
      }
    });
  }

  async findOne(id: number): Promise<BomLineItem> {
    try {
      const bomLineItem =  await this.bomLineItemRepository.findOne({where: {
        id
      }, relations: {
        rawMaterial: true,
        billOfMaterial: true
      }})
      return bomLineItem
    } catch (err) {
      throw new NotFoundException(`findOne failed as BOM Line Item with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateBomLineItemDto: UpdateBomLineItemDto): Promise<BomLineItem> {
    const bomLineItemToUpdate = await this.bomLineItemRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateBomLineItemDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      bomLineItemToUpdate[key] = value
    })
    return this.billOfMaterialRepository.save(bomLineItemToUpdate)
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
