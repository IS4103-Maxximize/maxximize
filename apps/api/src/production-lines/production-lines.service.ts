import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { ProductionLine } from './entities/production-line.entity';

@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectRepository(ProductionLine)
    private readonly productionLineRepository: Repository<ProductionLine>,
    private finalGoodService: FinalGoodsService,
  ) {}
  async create(createProductionLineDto: CreateProductionLineDto): Promise<ProductionLine> {
    try {
      const {name, description, finalGoodId, productionCostPerLot, changeOverTime} = createProductionLineDto
  

      const finalGood = await this.finalGoodService.findOne(finalGoodId)
      const newProductionLine = this.productionLineRepository.create({
        name,
        description,
        productionCostPerLot,
        changeOverTime: changeOverTime,
        created: new Date(),
        nextAvailableDateTime: new Date(),
        finalGoodId: finalGood.id,
        isAvailable: true,
        lastStopped: null
      })
      return this.productionLineRepository.save(newProductionLine)
    } catch (error) {
      throw new NotFoundException(`Final good with id: ${createProductionLineDto.finalGoodId} provided cannot be found!`)
    }
   
  }

  async findAll(): Promise<ProductionLine[]> {
    return this.productionLineRepository.find({
      relations: {
        finalGood: true,
        schedules: true
      }
    })
  }

  findOne(id: number): Promise<ProductionLine> {
    return this.productionLineRepository.findOne({where: {
      id
    }, relations: {
      finalGood: true,
      schedules: true
    }})
  }

  async update(id: number, updateProductionLineDto: UpdateProductionLineDto): Promise<ProductionLine> {
    const productionLineToUpdate = await this.findOne(id)
    const keyValuePairs = Object.entries(updateProductionLineDto)
    keyValuePairs.forEach(([key, value]) => {
      if (value) {
        productionLineToUpdate[key] = value
      }
    })
    return this.productionLineRepository.save(productionLineToUpdate)
  }

  async remove(id: number): Promise<ProductionLine> {
    const productionLineToRemove = await this.productionLineRepository.findOneBy({id})
    return this.productionLineRepository.remove(productionLineToRemove)
  }

  async updateNextAvailable(id: number, newScheduleEndDate: Date, entityManager: EntityManager) {
    const productionLine = await entityManager.findOneBy(ProductionLine, {
      id
    })
    const endDateInMilliseconds = new Date(newScheduleEndDate).getTime()
    const nextAvailableDTInMilliseconds = endDateInMilliseconds + productionLine.changeOverTime
    const nextAvailableDTInDateObject = new Date(nextAvailableDTInMilliseconds)
    await entityManager.update(ProductionLine, productionLine.id, {nextAvailableDateTime: nextAvailableDTInDateObject})
  }
}
