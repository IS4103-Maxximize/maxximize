import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartsService } from '../carts/carts.service';
import { FinalGoodsService } from '../final-goods/final-goods.service';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { CartLineItemsService } from './cart-line-items.service';
import { CartLineItem } from './entities/cart-line-item.entity';

describe('CartLineItemsService', () => {
  let service: CartLineItemsService;
  let cartLineItemsRepo
  let cartsService

  const finalGood = {
    id: 1,
    name: 'test name',
    description: 'test description',
    unit: MeasurementUnit.LITRE,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10
  }
  let cart = {
    id: 1,
    totalPrice: 0,
    totalWeight: 0,
    cartLineItems: [{
      id: 1,
      quantity: 30,
      finalGood: finalGood
    }]
  }
  const cartLineItem = {
    id: 1,
    quantity: 30,
    finalGood: finalGood,
    cart: cart
  }

  const mockCartLineItemsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(cartLineItem => {
      return {
        ...cartLineItem,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([cartLineItem]),
    findOneOrFail: jest.fn().mockResolvedValue(cartLineItem),
    remove: jest.fn().mockImplementation(cartLineItemToRemove => {
      return cartLineItemToRemove
    })
  }
  const mockFinalGoodsService = {findOne: jest.fn().mockResolvedValue(finalGood)}
  const mockCartsService = {
    update: jest.fn().mockImplementation((cartToUpdate, dto) => {
      return {...cartToUpdate, totalPrice: dto.totalPrice, totalWeight: dto.totalWeight}
    }),
    findOne: jest.fn().mockResolvedValue(cart),
    remove: jest.fn().mockImplementation(cartToRemove => {
      return cartToRemove
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartLineItemsService, {
        provide: getRepositoryToken(CartLineItem),
        useValue: mockCartLineItemsRepo
      }, {
        provide: FinalGoodsService,
        useValue: mockFinalGoodsService
      }, {
        provide: CartsService,
        useValue: mockCartsService
      }
    ],
    }).compile();

    cartsService = module.get<CartsService>(CartsService)
    cartLineItemsRepo = module.get<Repository<CartLineItem>>(getRepositoryToken(CartLineItem))
    service = module.get<CartLineItemsService>(CartLineItemsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      finalGoodId: 1, quantity: 30, cartId: 1
    }

    const dto2 = {
      finalGoodId: 1, quantity: 30, cartId: 2
    }

    const expected = cartLineItem
    it('should return a cart line item if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if cart or final good cannot be found', () => {
      jest.spyOn(cartsService, 'findOne').mockRejectedValueOnce(new NotFoundException('cart with this id: 2 cannot be found!'))
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('cart with this id: 2 cannot be found!'))
    })
  })

  describe('findAll', () => {
    it('should return all cart line items', async() => {
      const expected = [cartLineItem]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a cart line item', async() => {
      const expected = cartLineItem
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if cart line item with id cannot be found', () => {
      jest.spyOn(cartLineItemsRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException('cart Line Item with this id: 2 cannot be found!'))
    })
  })

  describe('update', () => {
    const updateDto = {
      quantity: 40
    }
    it('should return the updated cart line item', async() => {
      const expected = {
        ...cartLineItem,
        quantity: updateDto.quantity
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, quantity: 30})
    })
    it('should throw an exception if cart line item cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException('cart Line Item with this id: 2 cannot be found!'))
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('cart Line Item with this id: 2 cannot be found!'))
    })
  })

  describe('remove', () => {
    it('should return the removed cart line item if successful', async() => {
      await service.remove(1)
      const expected = cartLineItem
      expect(cartLineItemsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if cart line item cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException('cart Line Item with this id: 2 cannot be found!'))
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('cart Line Item with this id: 2 cannot be found!'))
    })
  })


});
