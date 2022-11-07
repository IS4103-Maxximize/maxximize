import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { Warehouse } from './entities/warehouse.entity';
import { WarehousesService } from './warehouses.service';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let organisationService: OrganisationsService;
  let warehouseRepo;

  const testWarehouse = {
    name: 'test warehouse',
    address: 'test address',
    description: 'test description',
    organisationId: 2
  };

  const organisation = {
    id: 2,
    name: 'manufacturer1',
    uen: '123Manu123',
    type: OrganisationType.MANUFACTURER
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehousesService, {
          provide: getRepositoryToken(Warehouse),
          useValue: {
            find: jest.fn().mockImplementation(() => {
              return [testWarehouse]
            }),
            findOneBy: jest.fn().mockImplementation(() => {
              return testWarehouse
            }),
            findOne: jest.fn().mockImplementation(() => {
              return testWarehouse
            }),
            delete: jest.fn().mockResolvedValue(testWarehouse),
          }
        }, {
          provide: OrganisationsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(organisation)
          }, 
        }, {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockImplementation(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              release: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              manager: {
                save: jest.fn().mockImplementation(() => {
                  return {
                    id: 1,
                    ...testWarehouse
                  }
                }),
                update: jest.fn().mockImplementation(() => {
                  return {
                    ...testWarehouse,
                    address: 'address 1 updated',
                    id: 1
                  }
                })
              }
            }))
          }
        }
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    organisationService = module.get<OrganisationsService>(OrganisationsService)
    warehouseRepo = module.get<Repository<Warehouse>>(getRepositoryToken(Warehouse))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      ...testWarehouse
    };
    it('it should return a warehouse entity', async () => {
      const expected = {
        id: 1,
        ...testWarehouse
      }
      expect(await service.create(dto)).toStrictEqual(expected);
    });

    it('should throw an exception if organisation is not found', () => {
      jest.spyOn(organisationService, 'findOne').mockRejectedValueOnce(new NotFoundException("organisation cannot be found"))
      expect(service.create({
        organisationId: 3, 
        ...dto
      })).rejects.toEqual(new NotFoundException("organisation cannot be found"))
    });
  });

  describe('findAll', () => {
    it('should return all warehouses', async() => {
      const expected = [testWarehouse]
      expect(await service.findAll()).toStrictEqual(expected)
    })

    it('should throw an exception if no warehouse is found', async () => {
      jest.spyOn(warehouseRepo, 'find').mockResolvedValueOnce([])
      expect(service.findAll()).rejects.toEqual(new NotFoundException('No warehouse(s) found!'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all warehouses of an organisation', async() => {
      const expected = [testWarehouse]
      expect(await service.findAllByOrgId(2)).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a warehouse', async() => {
      const expected = testWarehouse
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if warehouse cannot be found', () => {
      jest.spyOn(warehouseRepo, 'findOne').mockResolvedValueOnce(null)
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException(`No warehouse with id 2 found!`));
    })
  })

  describe('update', () => {
    it('should return the updated warehouse', async() => {
      const expected: any = {
        ...testWarehouse,
        address: 'address 1 updated',
        id: 1
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(expected)
      expect(await service.update(1, {
        address: 'address 1 updated'
      })).toStrictEqual(expected)
    })
  });

  describe('remove', () => {
    it('remove warehouse and return removed warehouse', async() => {
      expect(await service.remove(1)).toEqual(testWarehouse);
    })
  });

});
