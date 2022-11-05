import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { WarehousesService } from '../warehouses/warehouses.service';
import { Rack } from './entities/rack.entity';
import { RacksService } from './racks.service';

describe('RacksService', () => {
  let service: RacksService;
  let warehouseService: WarehousesService;
  let rackRepo;

  const testRack = {
    id: 1,
    name: "rack test",
    description: "description test",
  }

  const warehouse = {
    id: 2,
    name: 'manufacturer1',
    uen: '123Manu123',
    type: OrganisationType.MANUFACTURER
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RacksService, {
        provide: getRepositoryToken(Rack),
        useValue: {
          find: jest.fn().mockImplementation(() => {
            return [testRack]
          }),
          findOne: jest.fn().mockImplementation(() => {
            return testRack
          }),
          findOneOrFail: jest.fn().mockImplementation(() => {
            return testRack
          }),
          delete: jest.fn().mockResolvedValue(testRack),
        }
      }, {
        provide: WarehousesService,
        useValue: {
          findOne: jest.fn().mockResolvedValue(warehouse)
        }
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
                    ...testRack
                  }
                }),
                update: jest.fn().mockImplementation(() => {
                  return {
                    ...testRack,
                    name: 'name updated',
                    id: 1
                  }
                })
              }
            }))
          }
      }
    ],
    }).compile();

    service = module.get<RacksService>(RacksService);
    warehouseService = module.get<WarehousesService>(WarehousesService)
    rackRepo = module.get<Repository<Rack>>(getRepositoryToken(Rack))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      name: testRack.name,
      description: testRack.description,
      warehouseId: 1
    };
    it('it should return a rack entity', async () => {
      const expected: any = testRack;
      jest.spyOn(service, 'findOne').mockResolvedValue(expected)
      expect(await service.create(dto)).toStrictEqual(expected);
    });

    it('should throw an exception if warehouse is not found', () => {
      jest.spyOn(warehouseService, 'findOne').mockRejectedValueOnce(new NotFoundException("Warehouse with id 2 cannot be found"))
      expect(service.create({
        warehouseId: 2, 
        ...dto
      })).rejects.toEqual(new NotFoundException("Warehouse with id 2 cannot be found"))
    });
  });

  describe('findAll', () => {
    it('should return all racks', async() => {
      const expected = [testRack]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a rack', async() => {
      const expected = testRack
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if rack cannot be found', () => {
      jest.spyOn(rackRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('Rack with id: 2 not found'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all racks of an organisation', async() => {
      const expected = [testRack]
      expect(await service.findAllByOrganisationId(2)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    it('should return the updated rack', async() => {
      const expected: any = {
        ...testRack,
        name: 'rack test updated',
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(expected)
      expect(await service.update(1, {
        name: 'name 1 updated'
      })).toStrictEqual(expected)
    })
  });

  describe('remove', () => {
    it('remove warehouse and return removed warehouse', async() => {
      expect(await service.remove(1)).toEqual(testRack);
    })
  });


});
