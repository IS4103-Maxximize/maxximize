import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { Outlet } from './entities/outlet.entity';
import { OutletsService } from './outlets.service';

describe('OutletsService', () => {
  let service: OutletsService;
  let outletsRepo
  let organisationsService

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}
  const outlet = {
    id: 1,
    address: 'address',
    name: 'name',
    organisation: organisation
  }

  const mockOutletsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(outlet => {
      return {
        ...outlet,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([outlet]),
    findOneOrFail: jest.fn().mockResolvedValue(outlet),
    remove: jest.fn().mockImplementation(outletToRemove => {
      return outletToRemove
    })
  }
  const mockOrganisationsService = {findOne: jest.fn().mockResolvedValue(organisation)}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutletsService, {
        provide: getRepositoryToken(Outlet),
        useValue: mockOutletsRepo
      }, {
        provide: OrganisationsService,
        useValue: mockOrganisationsService
      }],
    }).compile();

    organisationsService = module.get<OrganisationsService>(OrganisationsService)
    outletsRepo = module.get<Repository<Outlet>>(getRepositoryToken(Outlet))
    service = module.get<OutletsService>(OutletsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      organisationId: 1, name: 'name', address: 'address'
    }

    const dto2 = {
      organisationId: 2, name: 'name', address: 'address'
    }

    const expected = outlet
    it('should return an outlet if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if organisation cannot be found', () => {
      jest.spyOn(organisationsService, 'findOne').mockRejectedValueOnce(new NotFoundException(`findOne failed as Organization with id: 2 cannot be found`))
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException(`findOne failed as Organization with id: 2 cannot be found`))
    })
  })

  describe('findAll', () => {
    it('should return all outlets', async() => {
      const expected = [outlet]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findAllByOrg', () => {
    it('should return all outlets in an organisation', async() => {
      const expected = [outlet]
      expect(await service.findAllByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return an outlet', async() => {
      const expected = outlet
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if outlet with id cannot be found', () => {
      jest.spyOn(outletsRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException(`outlet with this id: 2 cannot be found!`))
    })
  })

  describe('update', () => {
    const updateDto = {
      address: 'updated address'
    }
    it('should return the updated outlet', async() => {
      const expected = {
        ...outlet,
        address: updateDto.address
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, address: 'address'})
    })
    it('should throw an exception if outlet cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`outlet with this id: 2 cannot be found!`))
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException(`outlet with this id: 2 cannot be found!`))
    })
  })

  describe('remove', () => {
    it('should return the removed outlet if successful', async() => {
      await service.remove(1)
      const expected = outlet
      expect(outletsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if outlet cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`outlet with this id: 2 cannot be found!`))
      expect(service.remove(2)).rejects.toEqual(new NotFoundException(`outlet with this id: 2 cannot be found!`))
    })
  })

});
