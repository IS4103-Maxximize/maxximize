/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RacksService } from '../racks/racks.service';
import { BinsService } from './bins.service';
import { Bin } from './entities/bin.entity';

describe('BinsService', () => {
  let service: BinsService;
  let rackService: RacksService;
  let binRepo;

  const testRack = {
    id: 1,
    name: 'rack test',
    description: 'description test',
  };

  const testBin = {
    id: 1,
    name: 'testbin',
    volumetricSpace: 100,
    currentCapacity: 0,
    batchLineItems: [],
    rack: testRack
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinsService,
        {
          provide: getRepositoryToken(Bin),
          useValue: {
            find: jest.fn().mockImplementation(() => {
              return [testBin];
            }),
            findOne: jest.fn().mockImplementation(() => {
              return testBin;
            }),
            delete: jest.fn().mockImplementation(() => {
              return testBin;
            }),
          },
        },
        {
          provide: RacksService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(testRack),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockImplementation(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              release: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              manager: {
                save: jest.fn().mockImplementation((dto) => {
                  return {
                    id: 1,
                    ...dto
                  };
                }),
                update: jest.fn().mockImplementation((dto) => {
                  return {
                    ...testBin,
                    ...dto,
                    id: 1,
                  };
                }),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<BinsService>(BinsService);
    rackService = module.get<RacksService>(RacksService);
    binRepo = module.get<Repository<Bin>>(getRepositoryToken(Bin));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      name: 'testbin',
      volumetricSpace: 100,
      rackId: 1
    };
    it('it should return a bin entity', async () => {
      const expected = {
        id: 1,
        ...testBin,
      };
      expect(await service.create(dto)).toStrictEqual(expected);
    });

    it('should throw an exception if rack is not found', () => {
      jest.spyOn(rackService, 'findOne').mockRejectedValue(new NotFoundException("Rack with id: 2 not found"))
      expect(
        service.create({
          ...dto,
          rackId: 2
        })
      ).rejects.toEqual(new NotFoundException("Rack with id: 2 not found"));
    });
  });

  describe('findAll', () => {
    it('should return all bins', async() => {
      const expected = [testBin]
      expect(await service.findAll()).toStrictEqual(expected)
    })

    it('should throw throw expection if no bins are found', () => {
      jest.spyOn(binRepo, "find").mockRejectedValueOnce(new NotFoundException('No bin(s) found!'));
      expect(service.findAll()).rejects.toEqual(new NotFoundException('No bin(s) found!'));
    })
  })

  describe('findOne', () => {
    it('should return a bin', async() => {
      const expected = testBin
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if bin cannot be found', () => {
      jest.spyOn(binRepo, 'findOne').mockRejectedValueOnce(new NotFoundException(`No bin 2 found!`));
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException(`No bin 2 found!`));
    })
  })

  describe('findAllByOrg', () => {
    it('should return all bins of an organisation', async() => {
      const expected = [testBin]
      expect(await service.findAllByOrganisationId(2)).toStrictEqual(expected);
    })
  })

  describe('update', () => {
    it('should return the updated bin', async() => {
      const expected: any = {
        ...testBin,
        volumetricSpace: 200
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(expected)
      expect(await service.update(1, {
        volumetricSpace: 200
      })).toStrictEqual(expected)
    })

    it('should return the throw exception if bin cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`No bin 2 found!`));
      expect(service.update(2, {
        volumetricSpace: 200
      })).rejects.toEqual(new NotFoundException(`No bin 2 found!`));
    })
  });

  describe('remove', () => {
    it('remove bin and return removed warehouse', async() => {
      expect(await service.remove(1)).toEqual(testBin);
    })
  });

});
