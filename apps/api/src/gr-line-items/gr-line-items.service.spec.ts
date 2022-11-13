/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { GrLineItem } from './entities/gr-line-item.entity';
import { GrLineItemsService } from './gr-line-items.service';

describe('GrLineItemsService', () => {
  let service: GrLineItemsService;
  let rawMaterialService: RawMaterialsService;
  let dataSource: DataSource;

  const testProduct = {
    id: 1,
    name: 'test product',
    description: 'test desc',
    skuCode: 'test sku',
    unit: MeasurementUnit.KILOGRAM,
    lotQuantity: 1,
    type: 'RawMaterial',
    expiry: 1,
  };

  const grLineTest = {
    quantity: 10,
    product: testProduct,
    unitOfVolumetricSpace: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrLineItemsService,
        {
          provide: getRepositoryToken(GrLineItem),
          useValue: {
            find: jest.fn().mockImplementation(() => {
              return [grLineTest];
            }),
            findOneBy: jest.fn().mockImplementation(() => {
              return grLineTest;
            }),
            findOneOrFail: jest.fn().mockImplementation(() => {
              return grLineTest;
            }),
            delete: jest.fn().mockResolvedValue(grLineTest),
          },
        },
        {
          provide: RawMaterialsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(testProduct),
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
                    unitOfVolumetricSpace: dto.volumetricSpace,
                    ...dto
                  };
                }),
                update: jest.fn().mockImplementation((dto) => {
                  return {
                    ...grLineTest,
                    ...dto,
                    id: 1
                  };
                }),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<GrLineItemsService>(GrLineItemsService);
    rawMaterialService = module.get<RawMaterialsService>(RawMaterialsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      quantity: 10,
      rawMaterialId: 1,
      volumetricSpace: 10,
    };
    it('it should return a gr line entity', async () => {
      const expected = {
        id: 1,
        ...grLineTest,
      };
      expect(await service.create(dto)).toStrictEqual(expected);
    });

    it('should throw an exception if raw material is not found', () => {
      jest
        .spyOn(rawMaterialService, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException(`The raw material cannot be found`)
        );
      expect(
        service.create({
          rawMaterialId: 2,
          ...dto,
        })
      ).rejects.toEqual(
        new NotFoundException(`The raw material cannot be found`)
      );
    });
  });

  describe('create with transaction', () => {
    const dto = {
      quantity: 10,
      rawMaterialId: 1,
      volumetricSpace: 100,
    };

    it('it should return a gr line entity (transaction)', async () => {
      const expected = {
        id: 1,
        ...grLineTest,
      };
      expect(
        await service.createWithExistingTransaction(
          dto,
          dataSource.createQueryRunner()
        )
      ).toStrictEqual(expected);
    });

    it('should throw an exception if raw material is not found', () => {
      jest
        .spyOn(rawMaterialService, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException(`The raw material cannot be found`)
        );
      expect(
        service.createWithExistingTransaction(
          {
            rawMaterialId: 2,
            ...dto,
          },
          dataSource.createQueryRunner()
        )
      ).rejects.toEqual(
        new NotFoundException(`The raw material cannot be found`)
      );
    });
  });

  describe('findAll', () => {
    it('should return all gr line items', async() => {
      const expected = [grLineTest]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a gr line item', async() => {
      const expected = grLineTest
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    it('should return the updated gr line item', async() => {
      const expected: any = {
        ...grLineTest,
        quantity: 5,
        id: 1
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(expected)
      expect(await service.update(1, {
        quantity: 5
      })).toStrictEqual(expected)
    });

    it('should throw an error if gr line item cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`Gr line with id 2 not found`));
      expect(service.update(2, {
        quantity: 5
      })).rejects.toEqual(new NotFoundException(`Gr line with id 2 not found`));
    });
  });

  describe('remove', () => {
    it('remove gr line item', async() => {
      expect(await service.remove(1)).toEqual(grLineTest);
    })
  });


});
