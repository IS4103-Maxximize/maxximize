/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';

describe('CartsService', () => {
  let service: CartsService;
  let cartsRepo
  let organisationsService

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}
  const cart = {
    id: 1,
    organisation: organisation,
    supplier: {...organisation, id:2}
  }

  const mockCartsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(cart => {
      return {
        ...cart,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([cart]),
    findOneOrFail: jest.fn().mockResolvedValue(cart),
    remove: jest.fn().mockImplementation(cartToRemove => {
      return cartToRemove
    })
  }
  const mockOrganisationsService = {findOne: jest.fn().mockImplementation((id) => {return {...organisation, id: id}})}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService, {
        provide: getRepositoryToken(Cart),
        useValue: mockCartsRepo
      }, {
        provide: OrganisationsService,
        useValue: mockOrganisationsService
      }
    ],
    }).compile();

    cartsRepo = module.get<Repository<Cart>>(getRepositoryToken(Cart))
    organisationsService = module.get<OrganisationsService>(OrganisationsService)
    service = module.get<CartsService>(CartsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      organisationId: 1, supplierId: 2
    }

    const dto2 = {
      organisationId: 1, supplierId: 3
    }

    const expected = cart
    it('should return a cart if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if organisation or supplier cannot be found', () => {
      jest.spyOn(organisationsService, 'findOne').mockRejectedValueOnce(new NotFoundException(`findOne failed as Organization with id: 3 cannot be found`))
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException(`findOne failed as Organization with id: 3 cannot be found`))
    })
  })

  describe('findAll', () => {
    it('should return all carts', async() => {
      const expected = [cart]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('checkUniqueCart', () => {
    it('should return true if cart is unique', async() => {
      const expected = true
      expect(await service.checkUniqueCart(1, 2)).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a cart', async() => {
      const expected = cart
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if cart with id cannot be found', () => {
      jest.spyOn(cartsRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException(`cart with this id: 2 cannot be found!`))
    })
  })

  describe('findByOrg', () => {
    it('should return all carts in an organisation', async() => {
      const expected = [cart]
      expect(await service.findByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      totalPrice: 40
    }
    it('should return the updated cart', async() => {
      const expected = {
        ...cart,
        totalPrice: updateDto.totalPrice
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, totalPrice: undefined})
    })
    it('should throw an exception if cart cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`cart with this id: 2 cannot be found!`))
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException(`cart with this id: 2 cannot be found!`))
    })
  })

  describe('remove', () => {
    it('should return the removed cart if successful', async() => {
      await service.remove(1)
      const expected = cart
      expect(cartsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if cart cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`cart with this id: 2 cannot be found!`))
      expect(service.remove(2)).rejects.toEqual(new NotFoundException(`cart with this id: 2 cannot be found!`))
    })
  })

});
