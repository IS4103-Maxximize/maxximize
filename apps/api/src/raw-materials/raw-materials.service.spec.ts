import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { RawMaterial } from './entities/raw-material.entity';
import { RawMaterialsService } from './raw-materials.service';

describe('RawMaterialsService', () => {
  let service: RawMaterialsService;
  let organisationRepo
  let rawMaterialRepo

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}
  const rawMaterial = {
    id: 1,
    name: 'test name',
    description: 'test description',
    unit: MeasurementUnit.LITRE,
    unitPrice: 10,
    expiry: 10,
    lotQuantity: 10,
    organisation: organisation
  }

  const mockOrganisationRepo = {
    findOneByOrFail: jest.fn().mockResolvedValue(organisation)
  }

  const mockRawMaterialRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(rawMaterial => {
      return {
        ...rawMaterial,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([rawMaterial]),
    findOne: jest.fn().mockResolvedValue(rawMaterial),
    findOneBy: jest.fn().mockResolvedValue(rawMaterial),
    findOneByOrFail: jest.fn().mockResolvedValue(rawMaterial),
    remove: jest.fn().mockImplementation(rawMaterialToRemove => {
      return rawMaterialToRemove
    })
  }

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawMaterialsService, {
        provide: getRepositoryToken(Organisation),
        useValue: mockOrganisationRepo
      }, {
        provide: getRepositoryToken(RawMaterial),
        useValue: mockRawMaterialRepo
      }
    ],
    }).compile();

    rawMaterialRepo = module.get<Repository<RawMaterial>>(getRepositoryToken(RawMaterial))
    organisationRepo = module.get<Repository<Organisation>>(getRepositoryToken(Organisation))
    service = module.get<RawMaterialsService>(RawMaterialsService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      id: 1,
      name: 'test name',
      description: 'test description',
      unit: MeasurementUnit.LITRE,
      unitPrice: 10,
      expiry: 10,
      lotQuantity: 10,
      organisationId : 1
    }

    const dto2 = {
      id: 1,
      name: 'test name',
      description: 'test description',
      unit: MeasurementUnit.LITRE,
      unitPrice: 10,
      expiry: 10,
      lotQuantity: 10,
      organisationId : 2
    }

    const expected = rawMaterial
    it('should return a raw material if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if organisation cannot be found', () => {
      jest.spyOn(organisationRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('The organisation cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all raw materials', async() => {
      const expected = [rawMaterial]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a raw material', async() => {
      const expected = rawMaterial
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if raw material with id cannot be found', () => {
      jest.spyOn(rawMaterialRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('The raw material cannot be found'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all raw materials in an organisation', async() => {
      const expected = [rawMaterial]
      expect(await service.findAllByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      description: 'test description updated'
    }
    it('should return the updated raw material', async() => {
      const expected = {
        ...rawMaterial,
        description: updateDto.description
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, description: 'test description'})
    })
    it('should throw an exception if raw material cannot be found', () => {
      jest.spyOn(rawMaterialRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('The raw material cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed raw material if successful', async() => {
      await service.remove(1)
      const expected = rawMaterial
      expect(rawMaterialRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if raw material cannot be found', () => {
      jest.spyOn(rawMaterialRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('The raw material cannot be found'))
    })
  })

});
