import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterial } from './entities/raw-material.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepository: Repository<RawMaterial>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createRawMaterialDto: CreateRawMaterialDto): Promise<RawMaterial> {
    const {name, description, skuCode, unit, unitPrice, expiry} = createRawMaterialDto
    const newFinalGood = this.rawMaterialRepository.create({
      name,
      description,
      skuCode,
      unit,
      unitPrice,
      expiry
    })
    return this.rawMaterialRepository.save(newFinalGood);
  }

  findAll(): Promise<RawMaterial[]> {
    return this.rawMaterialRepository.find({})
  }

  async findOne(id: number): Promise<RawMaterial> {
    try {
      const product =  await this.rawMaterialRepository.findOne({where: {
        id
      }})
      return product
    } catch (err) {
      throw new NotFoundException(`findOne failed as Raw Material with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateRawMaterialDto: UpdateRawMaterialDto): Promise<RawMaterial> {
    try {
      const product = await this.rawMaterialRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateRawMaterialDto)
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
          } else {
            product[key] = value;
          }
      }
      await this.rawMaterialRepository.save(product)
      return this.rawMaterialRepository.findOne({where: {
        id
      }})
    } catch (err) {
      throw new NotFoundException(`update Failed as Raw Material with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<RawMaterial> {
    try {
      const product = await this.rawMaterialRepository.findOneBy({id})
      return this.rawMaterialRepository.remove(product);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Raw Material with id: ${id} cannot be found`)
    }
  }
}
