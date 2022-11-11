/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { RawMaterial } from './entities/raw-material.entity';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepository: Repository<RawMaterial>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>
  ){}

  async create(createRawMaterialDto: CreateRawMaterialDto): Promise<RawMaterial> {
    const {name, description, unit, unitPrice, expiry, organisationId, lotQuantity} = createRawMaterialDto;
    let organisationToBeAdded: Organisation
    organisationToBeAdded = await this.organisationsRepository.findOneByOrFail({id: organisationId})
    const newRawmaterialInstance = this.rawMaterialRepository.create({
      name,
      description,
      unit,
      unitPrice,
      expiry,
      lotQuantity,
      organisation: organisationToBeAdded
    })
    const newRawmaterial = await this.rawMaterialRepository.save(newRawmaterialInstance);
    const skuCode = `${newRawmaterial.id}-${name.toUpperCase().substring(0, 3)}`
    return this.update(newRawmaterial.id, { skuCode: skuCode })
  }

  findAll(): Promise<RawMaterial[]> {
    return this.rawMaterialRepository.find({
      relations: {
        organisation: true,
        suppliers: true,
        bomLineItems: true,
      }
    })
  }

  async findAllByOrg(organisationId: number): Promise<RawMaterial[]> {
    return this.rawMaterialRepository.find({
      where: {
        organisation: {
          id: organisationId
        }
      },
      relations: {
        organisation: true,
        suppliers: true,
        bomLineItems: true,
      }
    })
  }

  async findOne(id: number): Promise<RawMaterial> {
    try {
      const product =  await this.rawMaterialRepository.findOne({where: {
        id
      }, relations: {
        organisation: true,
        suppliers: true,
        bomLineItems: true,
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
            else if (key === 'skuCode') {
              product.skuCode = value;
            }
          } else {
            product[key] = value;
          }
      }
      await this.rawMaterialRepository.save(product);
      return this.findOne(id);
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
