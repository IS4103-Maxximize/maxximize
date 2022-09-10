import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {name, description, skuCode, unit, unitPrice, expiry} = createProductDto
    const newProduct = this.productRepository.create({
      name,
      description,
      skuCode,
      unit,
      unitPrice,
      expiry
    })
    return this.productRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({

    })
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({where: {
        id
      }})
      return product
    } catch (err) {
      throw new NotFoundException(`findOne failed as Product with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const productProperties = ['description', 'unitPrice', 'expiry']
    try {
      const product = await this.productRepository.findOne({where: {
        id
      }})
      const keyValuePairs = Object.entries(updateProductDto)
      for (let i = 0; i < keyValuePairs.length; i++) {
        const key = keyValuePairs[i][0]
        const value = keyValuePairs[i][1]
        if (value) {
          if (productProperties.includes(key)) {
            if (key === 'description') {
              product.description = value;
            }
            if (key === 'unitPrice') {
              product.unitPrice = value;
            }
            if (key === 'expiry') {
              product.expiry = value;
            }
          } else {
            product[key] = value //don't understand this line
          }
        }
      }
      await this.productRepository.save(product)
      return this.productRepository.findOne({where: {
        id
      }})
    } catch (err) {
      throw new NotFoundException(`update Failed as Product with id: ${id} cannot be found`)
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOneBy({id})
      return this.productRepository.remove(product);
    } catch (err) {
      throw new NotFoundException(`Remove failed as Product with id: ${id} cannot be found`)
    }
  }
}
