/**
 *
 * @group unit
 */

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { QaRule } from './entities/qa-rule.entity';
import { RuleCategory } from './enums/ruleCategory.enum';
import { QaRulesService } from './qa-rules.service';

describe('QaRulesService', () => {
  let service: QaRulesService;
  let organisationService
  let qaRuleRepo

  const rulesCategories = [{"label": "DRYSTORAGE", "value": "drystorage"}, 
  {"label": "REFRIGERATOR", "value": "refrigerator"}, 
  {"label": "FREEZER", "value": "freezer"}, 
  {"label": "PACKAGING", "value": "packaging"}, 
  {"label": "FOODQUALITY", "value": "foodquality"}]
  const organisation = {
    id: 2,
    name: 'manufacturer1',
    uen: '123Manu123',
    type: OrganisationType.MANUFACTURER
  }

  const qaRule = {
    id: 1,
    title: 'test title',
    description: 'just some random description',
    category: RuleCategory.FREEZER,
    organisationId: 2,
    created: new Date('2022-01-01')
  }
  const mockOrganisationService = {
    findOne: jest.fn().mockResolvedValue(organisation)
  }
  const mockQaRuleRepository = {
    create: jest.fn().mockImplementation(dto => {
      return {
        ...dto,
        created: new Date('2022-01-01')
      }
    }),
    save: jest.fn().mockImplementation(qaRule => {
      return {
        ...qaRule,
        id: 1
      }
    }),
    findAndCount: jest.fn().mockImplementation(() => {
      return [[qaRule], 1]
    }),
    findOneOrFail: jest.fn().mockResolvedValue(qaRule),
    remove:jest.fn().mockResolvedValue(qaRule)
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaRulesService, {
        provide: OrganisationsService,
        useValue: mockOrganisationService
      }, {
        provide: getRepositoryToken(QaRule),
        useValue: mockQaRuleRepository
      }],
    }).compile();

    organisationService = module.get<OrganisationsService>(OrganisationsService)
    qaRuleRepo = module.get<Repository<QaRule>>(getRepositoryToken(QaRule))
    service = module.get<QaRulesService>(QaRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      title: qaRule.title,
      description: qaRule.description,
      category: qaRule.category,
      organisationId: qaRule.organisationId
    }
    it('return the created QA rule', async() => {
      const expected = qaRule
      expect(await service.create(createDto)).toStrictEqual(expected)
    })
    it('should throw an exception if organisation is not found', () => {
      jest.spyOn(organisationService, 'findOne').mockRejectedValueOnce(new NotFoundException("organisation cannot be found"))
      expect(service.create(createDto)).rejects.toEqual(new NotFoundException("organisation cannot be found"))
    })
  })

  describe('findAll', () => {
    it('should return all QA rules', async() => {
      const expected = [qaRule]
      expect(await service.findAll()).toStrictEqual(expected)
    })
    it('should throw an exception if no qa rules found', () => {
      jest.spyOn(qaRuleRepo, 'findAndCount').mockResolvedValueOnce([[], 0])
      expect(service.findAll()).rejects.toEqual(new NotFoundException('No QA Rule found!'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return all QA rules of an organisation', async() => {
      const expected = [qaRule]
      expect(await service.findAllByOrg(2)).toStrictEqual(expected)
    })
    it('should throw an exception if no qa rules found in organisation', () => {
      jest.spyOn(qaRuleRepo, 'findAndCount').mockResolvedValueOnce([[], 0])
      expect(service.findAllByOrg(3)).rejects.toEqual(new NotFoundException('No QaRules found for this organisation with id: 3'))
    })
  })

  describe('findOne', () => {
    it('should return a qa rule', async() => {
      const expected = qaRule
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if qa rule cannot be found', () => {
      jest.spyOn(qaRuleRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('Qa rule of id: 2 cannot be found'))
    })
  })

  describe('findAllRuleCategory', () => {
    it('should return all rule categories', () => {
      expect(service.findAllRuleCategory()).toStrictEqual(rulesCategories)
    })
  })
  describe('update', () => {
    const updateDto = {
      title: 'newTitle'
    }
    it('should update qa rule and return updated rule', async() => {
      
      const expected = {
        ...qaRule,
        title: updateDto.title
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
    })
    it('should throw an exception if qa rule is not found', () => {
      jest.spyOn(qaRuleRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('Qa rule of id: 2 cannot be found'))
    })
  })
  describe('remove', () => {
    it('should remove qa rule and return removed rule', async() => {
      const expected = qaRule
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if qa rule cannot be found', () => {
      jest.spyOn(qaRuleRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.remove(2)).rejects.toEqual(new NotFoundException('Qa rule of id: 2 cannot be found'))
    })
  })
});
