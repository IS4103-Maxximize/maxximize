import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { CreateBillOfMaterialDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto } from './dto/update-bill-of-material.dto';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { NotFoundException } from '@nestjs/common';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Injectable()
export class BillOfMaterialsService {
  constructor(
    @InjectRepository(BillOfMaterial)
    private readonly billOfMaterialRepository: Repository<BillOfMaterial>,
    @InjectRepository(BomLineItem)
    private readonly bomLineItemRepository: Repository<BomLineItem>,
    private datasource: DataSource
  ){}

  async create(createBillOfMaterialDto: CreateBillOfMaterialDto): Promise<BillOfMaterial> {
    try{
      const {finalGoodId, bomLineItemDtos} = createBillOfMaterialDto
      let finalGoodToBeAdded: FinalGood
      let newBillOfMaterial: BillOfMaterial
      let bomLineItems: BomLineItem[] = []
      await this.datasource.manager.transaction(async (transactionalEntityManager) => {
        if (finalGoodId) {
          finalGoodToBeAdded = await transactionalEntityManager.findOneByOrFail(FinalGood, {
            id: finalGoodId
          })
        }
        for (const dto of bomLineItemDtos) {
          const { quantity, rawMaterialId } = dto
          let rawMaterialToBeAdded: RawMaterial
          let newBomLineItem: BomLineItem
          if (rawMaterialId) {
            rawMaterialToBeAdded = await transactionalEntityManager.findOneByOrFail(RawMaterial, {
              id: rawMaterialId
            })
          }
          newBomLineItem = transactionalEntityManager.create(BomLineItem, {
            quantity,
            rawMaterial: rawMaterialToBeAdded,
          })
          bomLineItems.push(newBomLineItem)
        }
        newBillOfMaterial = transactionalEntityManager.create(BillOfMaterial, {
          finalGood: finalGoodToBeAdded,
          bomLineItems
        })
        return transactionalEntityManager.save(newBillOfMaterial)
      })
      return await this.findOne(newBillOfMaterial.id);

    } catch (error) {
      throw new NotFoundException('The Entity cannot be found')
    }
  }

  async findAll(): Promise<BillOfMaterial[]> {
    return this.billOfMaterialRepository.find({
      relations: [
        "finalGood",
        "bomLineItems.rawMaterial"
      ]
    });
  }

  async findAllByOrg(id: number): Promise<BillOfMaterial[]> {
    return this.billOfMaterialRepository.find({
      where: {
        finalGood: {
          organisation: {
            id: id
          }
        }
      },
      relations: [
        "finalGood",
        "bomLineItems.rawMaterial",
        "productionOrders"
      ]
    });
  }

  async findOne(id: number): Promise<BillOfMaterial> {
    try {
      const billOfMaterial =  await this.billOfMaterialRepository.findOne({where: {
        id
      }, relations: [
        "finalGood",
        "bomLineItems.rawMaterial",
        "productionOrders"
      ]})
      return billOfMaterial
    } catch (err) {
      throw new NotFoundException(`findOne failed as Bill Of Material with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateBillOfMaterialDto: UpdateBillOfMaterialDto): Promise<BillOfMaterial> {
    const billOfMaterialToUpdate = await this.billOfMaterialRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateBillOfMaterialDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      billOfMaterialToUpdate[key] = value
    })
    return this.billOfMaterialRepository.save(billOfMaterialToUpdate)
  }

  async remove(id: number): Promise<BillOfMaterial> {
    const billOfMaterialToRemove = await this.billOfMaterialRepository.findOneBy({id})
    return this.billOfMaterialRepository.remove(billOfMaterialToRemove)
  }

}
