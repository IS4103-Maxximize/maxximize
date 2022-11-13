/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleStatus } from './enums/vehicleStatus.enum';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehiclesRepo
  let organisationsService
  let dataSource

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}
  const vehicle = {
    id: 1,
    description: 'description',
    isOperating: false,
    make: 'make',
    model: 'model',
    year: '2022',
    lastServiced: new Date('2022-11-11'),
    remarks: 'remarks',
    organisation: organisation,
    licensePlate: 'SLT9995Y',
    loadCapacity: 10,
    location: 'location',
    currentStatus: VehicleStatus.AVAILABLE
  }

  const mockVehiclesRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(vehicle => {
      return {
        ...vehicle,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([vehicle]),
    findOneBy: jest.fn().mockResolvedValue(vehicle),
    findOneOrFail: jest.fn().mockResolvedValue(vehicle),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([vehicle]),
    })),
    remove: jest.fn().mockImplementation(vehicleToRemove => {
      return vehicleToRemove
    })
  }
  const mockOrganisationsService = {findOne: jest.fn().mockResolvedValueOnce(organisation)}
  const mockDataSource = () => ({
    manager: {
      transaction: jest.fn()
    }
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService, {
        provide: getRepositoryToken(Vehicle),
        useValue: mockVehiclesRepo
      }, {
        provide: OrganisationsService,
        useValue: mockOrganisationsService
      }, {
        provide: DataSource,
        useFactory: mockDataSource
      }
    ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource)
    vehiclesRepo = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle))
    organisationsService = module.get<OrganisationsService>(OrganisationsService)
    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto1 = {
      description: 'description',
      isOperating: false,
      make: 'make',
      model: 'model',
      year: '2022',
      lastServiced: new Date('2022-11-11'),
      remarks: 'remarks',
      organisationId: 1,
      licensePlate: 'SLT9995Y',
      loadCapacity: 10,
      location: 'location'
    }

    const dto2 = {
      description: 'description',
      isOperating: false,
      make: 'make',
      model: 'model',
      year: '2022',
      lastServiced: new Date('2022-11-11'),
      remarks: 'remarks',
      organisationId: 2,
      licensePlate: 'SLT9995Y',
      loadCapacity: 10,
      location: 'location'
    }

    const expected = vehicle
    it('should return a vehicle if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if organisation cannot be found', () => {
      jest.spyOn(organisationsService, 'findOne').mockRejectedValueOnce(new NotFoundException(`findOne failed as Organization with id: 2 cannot be found`))
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException(`findOne failed as Organization with id: 2 cannot be found`))
    })
  })

  describe('findAll', () => {
    it('should return all vehicles', async() => {
      const expected = [vehicle]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a vehicle', async() => {
      const expected = vehicle
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if vehicle with id cannot be found', () => {
      jest.spyOn(vehiclesRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException(`vehicle with id: 2 cannot be found`))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all vehicles in an organisation', async() => {
      const expected = [vehicle]
      expect(await service.findAllByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      make: 'updated make'
    }
    it('should return the updated vehicle', async() => {
      const expected = {
        ...vehicle,
        make: updateDto.make
      }
      const mockedTransactionalEntityManager = {
        save: jest.fn(),
        findOne: jest.fn().mockResolvedValue(vehicle)
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, make: 'make'})
    })
    it('should throw an exception if vehicle cannot be found', () => {
      const expected = {
        ...vehicle,
        make: updateDto.make
      }
      const mockedTransactionalEntityManager = {
        save: jest.fn(),
        findOne: jest.fn().mockResolvedValue(vehicle)
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      jest.spyOn(mockedTransactionalEntityManager, 'findOne').mockRejectedValueOnce(new NotFoundException(`vehicle with this id: 2 cannot be found!`))
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException(`vehicle with this id: 2 cannot be found!`))
    })
  })

  describe('remove', () => {
    it('should return the removed vehicle if successful', async() => {
      await service.remove(1)
      const expected = vehicle
      expect(vehiclesRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if vehicle cannot be found', () => {
      jest.spyOn(vehiclesRepo, 'findOneBy').mockRejectedValueOnce(new NotFoundException(`vehicle with this id: 2 cannot be found!`))
      expect(service.remove(2)).rejects.toEqual(new NotFoundException(`vehicle with this id: 2 cannot be found!`))
    })
  })

});
