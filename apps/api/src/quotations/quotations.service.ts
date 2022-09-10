import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { Quotation } from './entities/quotation.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ShellOrganisation)
    private readonly shellOrganisationsRepository: Repository<ShellOrganisation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
  ) {}

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    try {
      const { lotQuantity, lotPrice, productCode, shellOrganisationId, unit} = createQuotationDto
      let shellOrganisationToBeAdded: ShellOrganisation
      let productToBeAdded: Product
      shellOrganisationToBeAdded = await this.shellOrganisationsRepository.findOneByOrFail({id: shellOrganisationId})
      productToBeAdded = await this.productsRepository.findOneByOrFail({id: productCode})
      const newQuotation = this.quotationsRepository.create({
        lotQuantity,
        lotPrice,
        unit,
        shellOrganisation: shellOrganisationToBeAdded,
        product: productToBeAdded
      })
      return this.quotationsRepository.save(newQuotation)
    } catch (error) {
      throw new NotFoundException('either product code or Shell org id cannot be found')
    }
  }

  findAll() {
    return this.quotationsRepository.find({
      relations: {
        shellOrganisation: true,
        product: true
      }
    })
  }

  findOne(id: number) {
    return this.quotationsRepository.findOne({where: {
      id
    }, relations: {
      shellOrganisation: true,
      product: true
    }})
  }

  async update(id: number, updateQuotationDto: UpdateQuotationDto) {
    //update lot quantity, lot price, unit
    //shell org and product should remain the same!

    const quotationToUpdate = await this.quotationsRepository.findOneBy({id})
    const arrayOfKeyValues = Object.entries(updateQuotationDto)
    arrayOfKeyValues.forEach(([key, value]) => {
      quotationToUpdate[key] = value
    })
    return this.quotationsRepository.save(quotationToUpdate)
  }

  async remove(id: number) {
    const quotationToRemove = await this.quotationsRepository.findOneBy({id})
    return this.quotationsRepository.remove(quotationToRemove)
  }
}
