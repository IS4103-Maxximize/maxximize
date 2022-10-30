import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { RuleCategory } from '../qa-rules/enums/ruleCategory.enum';
import { QaRulesService } from '../qa-rules/qa-rules.service';
import { QaChecklist } from './entities/qa-checklist.entity';
import { ProductType } from './enums/productType.enum';
import { QaChecklistsService } from './qa-checklists.service';

describe('QaChecklistsService', () => {
  let service: QaChecklistsService;
  let qaRulesService
  let qaChecklistRepo
  let organisationService
  

  const organisation = {
    id: 2,
    name: 'manufacturer1',
    uen: '123Manu123',
    type: OrganisationType.MANUFACTURER
  }

  const qaRule1 = {
    id: 1,
    title: 'test title',
    description: 'just some random description',
    category: RuleCategory.FREEZER,
    organisationId: 2,
    created: new Date('2022-01-01')
  }

  const qaRule2 = {
    id: 2,
    title: 'test title 2',
    description: 'just some random description 2',
    category: RuleCategory.FREEZER,
    organisationId: 2,
    created: new Date('2022-01-02')
  }

  const checklist = {
    id: 1,
    productType: ProductType.RAWMATERIAL,
    name: 'test checklist',
    qaRules: [qaRule1, qaRule2],
    organisationId: 2,
    created: new Date('2022-02-02')
  }

  const mockQaRulesService = {
    findOne: jest.fn().mockResolvedValueOnce(qaRule1).mockResolvedValueOnce(qaRule2)
  }
  const mockQaChecklistRepository = {
    create: jest.fn().mockImplementation(dto => {
      return {
        ...dto,
        created: new Date('2022-02-02')
      }
    }),
    save: jest.fn().mockImplementation(checklist => {
      return {
        ...checklist,
        id: 1
      }
    }),
    findAndCount: jest.fn().mockResolvedValue([[checklist], 1]),
    findOneOrFail: jest.fn().mockResolvedValue(checklist),
    remove: jest.fn().mockResolvedValue(checklist)
  }
  const mockOrganisationService = {
    findOne: jest.fn().mockImplementation(() => organisation)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaChecklistsService, {
        provide: QaRulesService,
        useValue: mockQaRulesService
      }, {
        provide: getRepositoryToken(QaChecklist),
        useValue: mockQaChecklistRepository
      }, {
        provide: OrganisationsService,
        useValue: mockOrganisationService
      }],
    }).compile();

    organisationService = module.get<OrganisationsService>(OrganisationsService)
    qaChecklistRepo = module.get<Repository<QaChecklist>>(getRepositoryToken(QaChecklist))
    qaRulesService = module.get<QaRulesService>(QaRulesService)
    service = module.get<QaChecklistsService>(QaChecklistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      productType: checklist.productType,
      qaRuleIds: [1, 2],
      organisationId: 2,
      name: checklist.name
    }
    const expected = checklist
    it('should create a checklist and return it', async() => {
      expect(await service.create(createDto)).toStrictEqual(expected)
    })
    it('should throw an exception if qaRule cannot be found', () => {
      jest.spyOn(qaRulesService, 'findOne').mockRejectedValueOnce(new NotFoundException("Qa rule cannot be found!"))
      expect(service.create(createDto)).rejects.toEqual(new NotFoundException("Qa rule cannot be found!"))
    })
  })
  describe('findAll', () => {
    it('should return all Qa checklists', async() => {
      const expected = [checklist]
      expect(await service.findAll()).toStrictEqual(expected)
    })
    it('should throw an exception if no checklists found', () => {
      jest.spyOn(qaChecklistRepo, 'findAndCount').mockResolvedValueOnce([[], 0])
      expect(service.findAll()).rejects.toEqual(new NotFoundException('No checklists found!'))
    })
  })
  describe('findAllByOrg', () => {
    it('should return all Qa checklists of an organisation', async() => {
      const expected = [checklist]
      expect(await service.findAllByOrg(2)).toStrictEqual(expected)
    })
    it('should throw an exception if no checklists found', () => {
      jest.spyOn(qaChecklistRepo, 'findAndCount').mockResolvedValueOnce([[], 0])
      expect(service.findAllByOrg(2)).rejects.toEqual(new NotFoundException('No Checklists found!'))
    })
  })
  describe('findOne', () => {
    it('should return a qa checklist', async() => {
      const expected = checklist
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if no checklist found', () => {
      jest.spyOn(qaChecklistRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('cannot find checklist with id: 2'))
    })
  })
  describe('update', () => {
    const updateDto = {
      name: 'new checklist name'
    }
    it('should update checklist and return updated checklist', async() => {
      const expected = {
        ...checklist,
        name: updateDto.name
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
    })
    it('should throw an exception if checklist cannot be found', () => {
      jest.spyOn(qaChecklistRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('cannot find checklist with id: 2'))
    })
  })
  describe('remove', () => {
    it('should remove a checklist and return the removed checklist', async() => {
      const expected = checklist
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if checklist cannot be found', () => {
      jest.spyOn(qaChecklistRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.remove(3)).rejects.toEqual(new NotFoundException('cannot find checklist with id: 3'))
    })
  })
  describe('retrieveQaRules', () => {
    it('should return QA rules based on input ids', async() => {
      const ids = [1, 2]
      jest.spyOn(qaRulesService, 'findOne').mockResolvedValueOnce(qaRule1).mockResolvedValueOnce(qaRule2)
      const expected = [qaRule1, qaRule2]
      expect(await service.retrieveQaRules(ids)).toStrictEqual(expected)
    })
    
  })
})
