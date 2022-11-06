import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    private organisationService: OrganisationsService
  ) {}
  async create(createCartDto: CreateCartDto) {
    const {organisationId, supplierId } = createCartDto
    const organisationToBeAdded = await this.organisationService.findOne(organisationId)
    const checkSupplier = await this.organisationService.findOne(supplierId)
    //call the create method of cart line item service
    const newCart = this.cartsRepository.create({
      organisation: organisationToBeAdded,
      supplierId: checkSupplier.id
    })
    return this.cartsRepository.save(newCart)
  }

  findAll() {
    return this.cartsRepository.find({
      relations: {
        organisation: true,
        cartLineItems: true
      }
    })
  }

  async findOne(id: number) {
    try {
      return await this.cartsRepository.findOneOrFail({
        where: {
          id
        }, relations: {
          organisation: true,
          cartLineItems: {
            finalGood: true
          }
        }
      })
    } catch (error) {
      throw new NotFoundException(`cart with this id: ${id} cannot be found!`)
    }
  }

  async findByOrg(orgId: number) {
    try {
      return await this.cartsRepository.findOneOrFail({
        where: {
          organisationId: orgId
        }, relations: {
          organisation: true,
          cartLineItems: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`no cart associated with this organisation`)
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cartToUpdate = await this.findOne(id)
    const keyValues = Object.entries(updateCartDto)
    for (const [key, value] of keyValues) {
      cartToUpdate[key] = value
    }
    return this.cartsRepository.save(cartToUpdate)
  }

  async remove(id: number) {
    const cartToRemove = await this.findOne(id)
    return this.cartsRepository.remove(cartToRemove)
  }
}
