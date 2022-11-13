/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevenueBracket } from './entities/revenue-bracket.entity';
import { RevenueBracketsService } from './revenue-brackets.service';

describe('RevenueBracketsService', () => {
  let service: RevenueBracketsService;
  let revenueBracketsRepo

  const revBracket = {
    id: 1,
    start: 1,
    end: 99,
    commisionRate: 10,
    organisationId: 1
  }

  const mockRevenueBracketsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(revBracket => {
      return {
        ...revBracket,
        id: 1
      }
    }),
    find: jest.fn().mockResolvedValue([revBracket]),
    findOneOrFail: jest.fn().mockResolvedValue(revBracket),
    remove: jest.fn().mockImplementation(revBracketToRemove => {
      return revBracketToRemove
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenueBracketsService, {
        provide: getRepositoryToken(RevenueBracket),
        useValue: mockRevenueBracketsRepo
      }],
    }).compile();

    service = module.get<RevenueBracketsService>(RevenueBracketsService);
    revenueBracketsRepo = module.get<Repository<RevenueBracket>>(getRepositoryToken(RevenueBracket))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      start: 1,
      end: 99,
      commisionRate: 10
    }
    it('return the created revenue bracket', async() => {
      const expected = revBracket
      expect(await service.create(createDto)).toStrictEqual(expected)
    })
  })

  describe('findAll', () => {
    it('should return all revenue brackets', async() => {
      const expected = [revBracket]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a revenue bracket', async() => {
      const expected = revBracket
      expect(await service.findOne(1)).toStrictEqual(expected)
    })

    it('should throw an exception if revenue bracket with id cannot be found', () => {
      jest.spyOn(revenueBracketsRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toStrictEqual(new NotFoundException(`revenue bracket with id: 2 cannot be found!`))
    })
  })

  describe('update', () => {
    const updateDto = {
      commisionRate: 11
    }
    it('should return the updated revenue bracket', async() => {
      const expected = {
        ...revBracket,
        commisionRate: updateDto.commisionRate
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, commisionRate: 10})
    })
    it('should throw an exception if revenue bracket cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`revenue bracket with id: 2 cannot be found!`))
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException(`revenue bracket with id: 2 cannot be found!`))
    })
  })

  describe('remove', () => {
    it('should return the removed revenue bracket if successful', async() => {
      await service.remove(1)
      const expected = revBracket
      expect(revenueBracketsRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if revenue bracket cannot be found', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException(`revenue bracket with id: 2 cannot be found!`))
      expect(service.remove(2)).rejects.toEqual(new NotFoundException(`revenue bracket with id: 2 cannot be found!`))
    })
  })

});
