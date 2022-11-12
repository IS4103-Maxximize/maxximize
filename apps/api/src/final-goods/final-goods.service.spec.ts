import { forwardRef, ForwardReference, ForwardReference, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoicesService } from '../invoices/invoices.service';
import { Organisation } from '../organisations/entities/organisation.entity';
import { MeasurementUnit } from '../products/enums/measurementUnit.enum';
import { FinalGood } from './entities/final-good.entity';
import { FinalGoodsService } from './final-goods.service';

describe('FinalGoodsService', () => {
  let service: FinalGoodsService;
  let organisationRepo
  let finalGoodRepo
  let invoicesService

  const organisation = {id: 1, name: 'organisation', uen: '123PARENT123'}
  const finalGood = {
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

  const mockFinalGoodRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(finalGood => {
      return {
        ...finalGood,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([finalGood]),
    findOne: jest.fn().mockResolvedValue(finalGood),
    findOneBy: jest.fn().mockResolvedValue(finalGood),
    findOneByOrFail: jest.fn().mockResolvedValue(finalGood),
    remove: jest.fn().mockImplementation(finalGoodToRemove => {
      return finalGoodToRemove
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalGoodsService, {
        provide: getRepositoryToken(Organisation),
        useValue: mockOrganisationRepo
      }, {
        provide: getRepositoryToken(FinalGood),
        useValue: mockFinalGoodRepo
      }],
    }).compile();

    organisationRepo = module.get<Repository<Organisation>>(getRepositoryToken(Organisation))
    finalGoodRepo = module.get<Repository<FinalGood>>(getRepositoryToken(FinalGood))
    invoicesService = module.get<InvoicesService>(InvoicesService)
    service = module.get<FinalGoodsService>(FinalGoodsService);
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

    const expected = finalGood
    it('should return a final good if successful', async() => {
      expect(await service.create(dto1)).toStrictEqual(expected)
    })

    it('should throw an exception if organisation cannot be found', () => {
      jest.spyOn(organisationRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error())
      expect(service.create(dto2)).rejects.toEqual(new NotFoundException('The organisation cannot be found'))
    })
  })

  describe('findAll', () => {
    it('should return all final goods', async() => {
      const expected = [finalGood]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a final good', async() => {
      const expected = finalGood
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if final good with id cannot be found', () => {
      jest.spyOn(finalGoodRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('The final good cannot be found'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all final goods in an organisation', async() => {
      const expected = [finalGood]
      expect(await service.findAllByOrg(1)).toStrictEqual(expected)
    })
  })

  describe('update', () => {
    const updateDto = {
      description: 'test description updated'
    }
    it('should return the updated final good', async() => {
      const expected = {
        ...finalGood,
        description: updateDto.description
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, description: 'test description'})
    })
    it('should throw an exception if final good cannot be found', () => {
      jest.spyOn(finalGoodRepo, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('The final good cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return the removed final good if successful', async() => {
      await service.remove(1)
      const expected = finalGood
      expect(finalGoodRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if final good cannot be found', () => {
      jest.spyOn(finalGoodRepo, 'findOneBy').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('The final good cannot be found'))
    })
  })

});
