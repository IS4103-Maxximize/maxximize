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
    const checkUniqueCart = await this.checkUniqueCart(organisationId, supplierId)
    if (!checkUniqueCart) {
      //not unique
      throw new NotFoundException('Cart`s supplier Id must be unique!')
    }
    //need to check theres already a cart with the same supplier
    //call the create method of cart line item service
    const newCart = this.cartsRepository.create({
      organisation: organisationToBeAdded,
      supplier: checkSupplier
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

  async checkUniqueCart(organisationId: number, supplierId: number) {
    const carts = await this.findByOrg(organisationId)
    const isUnique = carts.every(cart => cart.supplierId !== supplierId)
    return isUnique
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
    return this.cartsRepository.find({
      where: {
        organisationId: orgId
      }, relations: {
        cartLineItems: true
      }
    })
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
