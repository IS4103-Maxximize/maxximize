import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartsService } from '../carts/carts.service';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { CreateCartLineItemDto } from './dto/create-cart-line-item.dto';
import { UpdateCartLineItemDto } from './dto/update-cart-line-item.dto';
import { CartLineItem } from './entities/cart-line-item.entity';

@Injectable()
export class CartLineItemsService {
  constructor(
    @InjectRepository(CartLineItem)
    private readonly cartLineItemsRepository: Repository<CartLineItem>,
    private finalGoodsService: FinalGoodsService,
    private cartsService: CartsService
  ) {}
  async create(createCartLineItemDto: CreateCartLineItemDto) {
    const {finalGoodId, quantity, cartId} = createCartLineItemDto
    const finalGood = await this.finalGoodsService.findOne(finalGoodId)
    const cart = await this.cartsService.findOne(cartId)
    const newCartLineItem = this.cartLineItemsRepository.create({
      finalGood,
      quantity,
      cart
    })
    const savedCartLineItem = await this.cartLineItemsRepository.save(newCartLineItem)
    //need to update the totalPrice and Weight
    const newTotalWeight = cart.totalWeight += quantity
    const newTotalPrice = cart.totalPrice += quantity * finalGood.unitPrice
    await this.cartsService.update(cart.id, {totalPrice: newTotalPrice, totalWeight: newTotalWeight})
    return this.findOne(savedCartLineItem.id)
    
  }

  findAll() {
    return this.cartLineItemsRepository.find({
      relations: {
        finalGood: true
      }
    })
  }

  async findOne(id: number) {
    try {
      return await this.cartLineItemsRepository.findOneOrFail({
        where: {
          id
        }, relations: {
          finalGood: true,
        }
      })
    } catch (error) {
      throw new NotFoundException(`cart Line Item with this id: ${id} cannot be found!`)
    }
  }

  async update(id: number, updateCartLineItemDto: UpdateCartLineItemDto) {
    const cartLineItemToUpdate = await this.findOne(id)
    const keyValues = Object.entries(updateCartLineItemDto)
    for (const [key, value] of keyValues) {
      if (key === 'quantity') {
        const differenceQuantity = value - cartLineItemToUpdate.quantity
        //need to update the cart totalPrice and totalWeight
        const cart = await this.cartsService.findOne(cartLineItemToUpdate.cartId)
        const newTotalPrice = cart.totalPrice += differenceQuantity * cartLineItemToUpdate.finalGood.unitPrice
        const newTotalWeight = cart.totalWeight += differenceQuantity
        await this.cartsService.update(cart.id, {
          totalPrice: newTotalPrice,
          totalWeight: newTotalWeight
        })
      } 
      cartLineItemToUpdate[key] = value
    }
    return this.cartLineItemsRepository.save(cartLineItemToUpdate)
  }

  async remove(id: number) {
    const cartLineItemToRemove = await this.findOne(id)
    await this.cartLineItemsRepository.remove(cartLineItemToRemove)
    //need to update the cart's totalPrice and totalWeight
    const cart = await this.cartsService.findOne(cartLineItemToRemove.cartId)
    const newTotalPrice = cart.totalPrice -= cartLineItemToRemove.quantity * cartLineItemToRemove.finalGood.unitPrice
    const newTotalWeight = cart.totalWeight -= cartLineItemToRemove.quantity
    await this.cartsService.update(cart.id, {
      totalPrice: newTotalPrice,
      totalWeight: newTotalWeight
    })
    return cartLineItemToRemove
  }
}
