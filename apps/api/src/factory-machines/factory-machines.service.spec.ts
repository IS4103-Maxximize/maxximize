import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { OrganisationsService } from '../organisations/organisations.service';
import { ProductionLinesService } from '../production-lines/production-lines.service';
import { ScheduleType } from '../schedules/enums/scheduleType.enum';
import { FactoryMachine } from './entities/factory-machine.entity';
import { FactoryMachinesService } from './factory-machines.service';

describe('FactoryMachinesService', () => {
  let service: FactoryMachinesService;
  let factoryMachineRepo
  let organisationService
  const organisation = {
    id: 1,
    name: 'maxximize',
    type: OrganisationType.MAXXIMIZE,
    uen: '123Max123'
  }
  const factoryMachine = {
    id: 1,
    serialNumber: 'serial123',
    description: 'test',
    isOperating: true,
    make: 'toyota',
    model: 'civic',
    year: '2000',
    lastServiced: new Date('2022-01-01'),
    remarks: 'test',
    organisationId: 1
  }
  const mockOrganisationService = {
    findOne: jest.fn().mockImplementation(() => {
      return organisation
    })
  }
  const mockFactoryMachineRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(factoryMachine => {
      return {
        ...factoryMachine,
        id: 1
      }
    }),
    findOneOrFail: jest.fn().mockResolvedValue(factoryMachine),
    find: jest.fn().mockResolvedValue([factoryMachine]),
    remove: jest.fn().mockResolvedValue(factoryMachine)
  }
  const mockProductionLineService = {
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'PL1',
      schedules: [
        {
          id: 1,
          status: ScheduleType.ONGOING
        }
      ]
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactoryMachinesService, {
        provide: OrganisationsService,
        useValue: mockOrganisationService
      }, {
        provide: getRepositoryToken(FactoryMachine),
        useValue: mockFactoryMachineRepository
      }, {
        provide: ProductionLinesService,
        useValue: mockProductionLineService
      }],
    }).compile();

    organisationService = module.get<OrganisationsService>(OrganisationsService)
    factoryMachineRepo = module.get<Repository<FactoryMachine>>(getRepositoryToken(FactoryMachine))
    service = module.get<FactoryMachinesService>(FactoryMachinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      serialNumber: 'serial123',
      description: 'test',
      isOperating: true,
      make: 'toyota',
      model: 'civic',
      year: '2000',
      lastServiced: new Date('2022-01-01'),
      remarks: 'test',
      organisationId: 1
    }
    it('should return the created factory machine', async() => {
      const expected = factoryMachine
      expect(await service.create(createDto)).toStrictEqual(expected)
      expect(factoryMachineRepo.save).toBeCalledWith(createDto)
    })
    it('should return an exception if the organisation provided is invalid', async() => {
      jest.spyOn(organisationService, 'findOne').mockRejectedValueOnce(new Error())
      expect(service.create(createDto)).rejects.toEqual(new NotFoundException('Not Found'))
    })
  })
  describe('findAll', () => {
    it('should return all factory Machines', async() => {
      const expected = [factoryMachine]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  })
  describe('findOne', () => {
    it('should return a factory Machine', async() => {
      const expected = factoryMachine
      expect(await service.findOne(1)).toStrictEqual(expected)
    })
    it('should throw an exception if machine with id cannot be found', () => {
      jest.spyOn(factoryMachineRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('factory machine with id: 2 cannot be found'))
    })
  })
  describe('findAllByOrg', () => {
    it('should return all factory machines in an organisation', async() => {
      const expected = [factoryMachine]
      expect(await service.findAllByOrg(1)).toStrictEqual(expected)
    })
  })
  describe('update', () => {
    const updateDto = {
      make: 'honda'
    }
    it('should return the updated factory machine', async() => {
      const expected = {
        ...factoryMachine,
        make: updateDto.make
      }
      expect(await service.update(1, updateDto)).toStrictEqual(expected)
      //reset
      await service.update(1, {...updateDto, make: 'toyota'})
    })
    it('should throw an exception if factory machine cannot be found', () => {
      jest.spyOn(factoryMachineRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(2, updateDto)).rejects.toEqual(new NotFoundException('factory machine with id: 2 cannot be found'))
    })
  })

  describe('remove', () => {
    it('should return factory machine if successful', async() => {
      await service.remove(1)
      const expected = factoryMachine
      expect(factoryMachineRepo.remove).toBeCalled()
      expect(await service.remove(1)).toStrictEqual(expected)
    })
    it('should throw an exception if there an ongoing or planned schedule', () => {
      jest.spyOn(factoryMachineRepo, 'findOneOrFail').mockResolvedValue({
        ...factoryMachine,
        productionLineId: 1
      })
      expect(service.remove(1)).rejects.toEqual(new BadRequestException('There is a schedule that is ongoing/planned, delete Machine after these are done!'))
    })
  })
});
