import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BinsService } from './bins.service';
import { Bin } from './entities/bin.entity';

describe('BinsService', () => {
  let service: BinsService;

  const testBin = {
    name: "testbin",
    volumetricSpace: 100,
    rackId: 1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinsService, {
        provide: getRepositoryToken(Bin),
        useValue: {
          find: jest.fn().mockImplementation(() => {
            return [testBin]
          }),
          findOne: jest.fn().mockImplementation(() => {
            return testBin
          }),
          delete: jest.fn().mockImplementation(() => {
            return testBin
          }),
        }
      },{
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
                  ...testBin
                }
              }),
              update: jest.fn().mockImplementation(() => {
                return {
                  ...testBin,
                  name: "testbin updated",
                  id: 1
                }
              })
            }
          }))
        }
      }
    ],
    }).compile();

    service = module.get<BinsService>(BinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
