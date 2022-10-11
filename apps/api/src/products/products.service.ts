import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { BinsService } from '../bins/bins.service';
import { ProductMasterList } from './dto/product-masterlist.dto';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private binsService: BinsService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {name, description, unit, unitPrice, expiry} = createProductDto
    const newProductInstance = this.productRepository.create({
      name,
      description,
      unit,
      unitPrice,
      expiry
    })
    const newProduct = await this.productRepository.save(newProductInstance);
    return this.productRepository.save({
      skuCode:`${newProduct.id}-${name.toUpperCase().substring(0, 3)}`,
      ...newProduct
    });
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({

    })
  }

  async findAllByOrg(id: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        organisation: {
          id: id
        }
      },
      relations: {
        organisation: true,
      }
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

  async findAllProductsByOrganisationId(id: number) {
    const bins = await this.binsService.findAllByOrganisationId(id);
    const productsQuantityMap = new Map<number, ProductMasterList>();
    for (const bin of bins) {
      for (const batchLineItem of bin.batchLineItems) {
        if (productsQuantityMap.has(batchLineItem.product.id)) {
          const list = productsQuantityMap.get(batchLineItem.product.id);
          list.totalQuantity += batchLineItem.quantity;
          list.reservedQuantity += batchLineItem.reservedQuantity;
          list.batchLineItems.push(batchLineItem);
          productsQuantityMap.set(batchLineItem.product.id, list);
        } else {
          const productMasterList = new ProductMasterList();
          productMasterList.product = batchLineItem.product;
          productMasterList.totalQuantity = batchLineItem.quantity;
          productMasterList.reservedQuantity = batchLineItem.reservedQuantity;

          const batchLineItems: BatchLineItem[] = [];
          batchLineItems.push(batchLineItem);
          productMasterList.batchLineItems = batchLineItems;
          productsQuantityMap.set(batchLineItem.product.id, productMasterList);
        }
      }
    }
    return Object.fromEntries(productsQuantityMap)
  }

}
