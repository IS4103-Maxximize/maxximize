/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { FinalGood } from './entities/final-good.entity';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';
import { NotFoundException } from '@nestjs/common';
import { Organisation } from '../organisations/entities/organisation.entity';

@Injectable()
export class FinalGoodsService {
  constructor(
    @InjectRepository(FinalGood)
    private readonly finalGoodRepository: Repository<FinalGood>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(BillOfMaterial)
    private readonly billOfMaterialRepository: Repository<BillOfMaterial>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>
  ){}

  async create(createFinalGoodDto: CreateFinalGoodDto): Promise<FinalGood> {
    const {name, description, unit, unitPrice, expiry, organisationId} = createFinalGoodDto
    let organisationToBeAdded: Organisation
    organisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: organisationId})
    const newFinalGoodInstance = this.finalGoodRepository.create({
      name,
      description,
      unit,
      unitPrice,
      expiry,
      organisation: organisationToBeAdded
    });
    const newFinalGood = await this.finalGoodRepository.save(newFinalGoodInstance);
    return this.finalGoodRepository.save({
      skuCode:`${newFinalGood.id}-${name.toUpperCase().substring(0, 3)}`,
      ...newFinalGood
    });
  }

  findAll(): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({})
  }

  async findAllByOrg(organisationId: number): Promise<FinalGood[]> {
    return this.finalGoodRepository.find({
      where: {
        organisation: await this.organisationsRepository.findOneByOrFail({id: organisationId})
      }
    })
  }

  async findOne(id: number): Promise<FinalGood> {
    try {
      const finalGood =  await this.finalGoodRepository.findOne({where: {
        id
      }})
      return finalGood
    } catch (err) {
      throw new NotFoundException(`findOne failed as Final Good with id: ${id} cannot be found`)
    }
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
            } else {
            product[key] = value
          }
        }
      }
      return this.finalGoodRepository.save(product)
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
