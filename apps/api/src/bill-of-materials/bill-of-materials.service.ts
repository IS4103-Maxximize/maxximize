import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { CreateBillOfMaterialDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto } from './dto/update-bill-of-material.dto';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BillOfMaterialsService {
  constructor(
    @InjectRepository(BillOfMaterial)
    private readonly billOfMaterialRepository: Repository<BillOfMaterial>,
    @InjectRepository(BomLineItem)
    private readonly bomLineItemRepository: Repository<BomLineItem>,
  ){}

  async create(createBillOfMaterialDto: CreateBillOfMaterialDto): Promise<BillOfMaterial> {
    const {finalGood, bomLineItems} = createBillOfMaterialDto
    if (bomLineItems) {
      for (let i=0;i<bomLineItems.length;i++){
        await this.bomLineItemRepository.save(bomLineItems[i])
      }
    }
    const newBillOfMaterial = this.billOfMaterialRepository.create({
      finalGood,
      bomLineItems
    })
    return this.billOfMaterialRepository.save(newBillOfMaterial);
  }

  async findAll(): Promise<BillOfMaterial[]> {
    return this.billOfMaterialRepository.find({
      relations: {
        finalGood: true,
      }
    });
  }



  async findOne(id: number): Promise<BillOfMaterial> {
    try {
      const billOfMaterial =  await this.billOfMaterialRepository.findOne({where: {
        id
      }, relations: {
        finalGood: true
      }})
      return billOfMaterial
    } catch (err) {
      throw new NotFoundException(`findOne failed as Bill Of Material with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateBillOfMaterialDto: UpdateBillOfMaterialDto): Promise<BillOfMaterial> {
    try {
      const billOfMaterial = await this.billOfMaterialRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateBillOfMaterialDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        if (value) {
          if (key === 'bomLineItems') {
            const bomLineItems = []
            for (let i=0;i<updateBillOfMaterialDto.bomLineItems.length;i++){
              await this.bomLineItemRepository.save(updateBillOfMaterialDto.bomLineItems[i])
              bomLineItems.push(updateBillOfMaterialDto.bomLineItems[i])
            }
            billOfMaterial['bomLineItems'] = bomLineItems
          } else {
            billOfMaterial[key] = value
          }
        }
      }
      return this.bomLineItemRepository.save(billOfMaterial)
    } catch (err) {
      throw new NotFoundException(`update Failed as Bill Of Material with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<BillOfMaterial> {
    try {
      const billOfMaterial = await this.billOfMaterialRepository.findOneBy({id})
      return this.billOfMaterialRepository.remove(billOfMaterial);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Bill Of Material with id: ${id} cannot be found`)
    }
  }

}
