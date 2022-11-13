import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../contacts/entities/contact.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationType } from '../organisations/enums/organisationType.enum';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { ShellOrganisation } from './entities/shell-organisation.entity';
import { ShellOrganisationsService } from './shell-organisations.service';

describe('ShellOrganisationsService', () => {
  let service: ShellOrganisationsService;
  let shellOrgRepo
  let orgRepo
  let rawMaterialRepo
  let contactsRepo

  const parent = {id: 2, name: 'parent', uen: '123PARENT123'}
  const shellOrganisation = {
    id: 1,
    name: "Tomato Farm Bali",
    type: OrganisationType.SUPPLIER,
    uen: "123TOM123",
    parentOrganisation: parent,
    contact: null
  }

  

  const mockShellOrgRepo = {
    create: jest.fn().mockImplementation(dto => {
      return {
        ...dto,
        parentOrganisation: parent,
        created: new Date("2022-10-29T04:04:08.715Z")
      }
    }),
    save: jest.fn().mockImplementation(shellOrganisation => Promise.resolve({id: 1, ...shellOrganisation})),
    find: jest.fn().mockResolvedValue([shellOrganisation]),
    findOne: jest.fn().mockResolvedValue(shellOrganisation),
    findOneOrFail: jest.fn().mockResolvedValue(shellOrganisation),
    findOneBy: jest.fn().mockResolvedValue(shellOrganisation),
    remove: jest.fn().mockImplementation(shellOrganisation => Promise.resolve(shellOrganisation))
  }
  const mockOrgRepo = {
    findOneBy: jest.fn().mockResolvedValue(parent),
    findOne: jest.fn().mockResolvedValue(parent)
  }
  const mockRawMaterialRepo = {
    findOneBy: jest.fn().mockResolvedValueOnce({id: 1, name: 'RM1'}).mockResolvedValueOnce({id: 2, name: 'RM2'})
  }
  const mockContactsRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(contact => {
      return {
        ...contact,
        id: 1,
      }
    })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShellOrganisationsService, {
        provide: getRepositoryToken(ShellOrganisation),
        useValue: mockShellOrgRepo
      }, {
        provide: getRepositoryToken(Organisation),
        useValue: mockOrgRepo
      }, {
        provide: getRepositoryToken(RawMaterial),
        useValue: mockRawMaterialRepo
      }, {
        provide: getRepositoryToken(Contact),
        useValue: mockContactsRepo
      }],
    }).compile();

    orgRepo = module.get<Repository<Organisation>>(getRepositoryToken(Organisation))
    shellOrgRepo = module.get<Repository<ShellOrganisation>>(getRepositoryToken(ShellOrganisation))
    service = module.get<ShellOrganisationsService>(ShellOrganisationsService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      name: shellOrganisation.name,
      type: shellOrganisation.type,
      uen: shellOrganisation.uen,
      organisationId: 2
    }
    it('should return a shell organisation', async() => {
      const expectedObject = {
        id: 1,
        name: dto.name,
        type: dto.type,
        uen: dto.uen,
        parentOrganisation: parent,
        created: new Date("2022-10-29T04:04:08.715Z"),
        contact: null,
        creditLimit: null,
        currentCredit: 0
      }
      jest.spyOn(service, 'retrieveUensInParentOrg').mockResolvedValue([])
      expect(await service.create(dto)).toStrictEqual(expectedObject)
    })

    it('should return exception if UEN is already used', () => {
      jest.spyOn(service, 'retrieveUensInParentOrg').mockResolvedValue(['123TOM123'])
      expect(service.create(dto)).rejects.toEqual(new NotFoundException('UEN already exists within your organisation!'))
    })
  })
  describe('findAll', () => {
    it('should return all shellOrgansations', async() => {
      const expectedArray = [shellOrganisation]
      expect(service.findAll()).resolves.toStrictEqual(expectedArray)
    })
  })

  describe('findOne', () => {
    it('should return shellOrganisation', () => {
      expect(service.findOne(1)).resolves.toStrictEqual(shellOrganisation)
    })
    it('should throw an exception if no shell org found', () => {
      const spy = jest.spyOn(shellOrgRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(2)).rejects.toEqual(new NotFoundException('the shell organisation with id:2 cannot be found!'))
    })
  })

  describe('findAllByOrg', () => {
    it('should return shellOrganisations of that org', async() => {
      expect(await service.findAllByOrg(2)).toStrictEqual([shellOrganisation])
    })
  })

  describe('retrieveUensInParentOrg', () => {
    it('should return all UENs in parentOrg including parent`s UEN', async() => {
      const expectedArray = [shellOrganisation.uen, parent.uen]
      jest.spyOn(orgRepo, 'findOne').mockResolvedValue({...parent, shellOrganisations: [shellOrganisation]})
      expect(await service.retrieveUensInParentOrg(2)).toStrictEqual(expectedArray)
    })
  })

  describe('update', () => {
    const updateDto = {
      name: 'Tomato Farm Bali Updated'
    }
    it('should return an updated shell organisation', async() => {
      const expectedOutput = {
        ...shellOrganisation,
        name: updateDto.name
      }
      expect(await service.update(2, updateDto)).toStrictEqual(expectedOutput)
    })
    it('should throw an exception if shell org is not found', () => {
      const spy = jest.spyOn(shellOrgRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(3, updateDto)).rejects.toEqual(new NotFoundException('the shell organisation with id:3 cannot be found!'))
    })
  })

  describe('remove', () => {
    it('should return removed shell organisation', async() => {
      expect(await service.remove(1)).toStrictEqual(shellOrganisation)
    })
  })

  describe('retrieveUpdatedContact', () => {
    it('should return the newly saved contact', async() => {
      const shellOrganisationDto: any = shellOrganisation
      const contactDto: any = {
        address: 'address',
        phoneNumber: 'phoneNumber',
        email: 'test@gmail.com',
        postalCode: '998998'
      }
      const expected = {
        ...contactDto,
        id: 1
      }
      expect(await service.retrieveUpdatedContact(shellOrganisationDto, contactDto)).toStrictEqual(expected)
    })
  })

  describe('retrieveRawMaterials', () => {
    it('should return an array of raw Materials', async() => {
      const expectedValues = [
        {id: 1, name: 'RM1'},
        {id: 2, name: 'RM2'}
      ]
      expect(await service.retrieveRawMaterials([1,2])).toStrictEqual(expectedValues)
    })
  })

});
