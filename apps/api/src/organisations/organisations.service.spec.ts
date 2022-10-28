import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { debugPort } from 'process';
import { DataSource, Repository } from 'typeorm';
import { Contact } from '../contacts/entities/contact.entity';
import { MailService } from '../mail/mail.service';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { Role } from '../users/enums/role.enum';
import { UsersService } from '../users/users.service';;
import { Organisation } from './entities/organisation.entity';
import { OrganisationType } from './enums/organisationType.enum';
import { OrganisationsService } from './organisations.service';
import { shellOrganisationsWithMatch} from './testing/data'

describe('OrganisationsService', () => {
  let service: OrganisationsService;
  let dataSource
  let organisationRepo

  const testOrganisation = {
    id: 1,
    name: 'test',
    uen: '12345678'
  }
  const mockOrganisationsRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(organisation => Promise.resolve({id: 1, ...organisation})),
    find: jest.fn().mockImplementation(() => {
      return [testOrganisation]
    }),
    findOneOrFail: jest.fn().mockImplementation(() => {
      return testOrganisation
    }),
    findOne: jest.fn().mockImplementation(() => {
      return testOrganisation
    }),
    remove: jest.fn().mockResolvedValue(testOrganisation),
    findOneBy: jest.fn().mockResolvedValue(testOrganisation),
    findBy: jest.fn().mockResolvedValue(testOrganisation)
  }
  const mockContactsRepository = {
    save: jest.fn().mockImplementation(contact => Promise.resolve({id: 1, ...contact})),
  }
  const mockUsersService = {
    findByUsername: jest.fn().mockImplementation(() => null),
    getAllEmailsInOrganisation: jest.fn().mockImplementation(() => [])
  }
  const mockDataSource = () => ({
    manager: {
      transaction: jest.fn()
    }
  })
  const mockMailService = {
    sendPasswordEmail: jest.fn()
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationsService, {
        provide: getRepositoryToken(Organisation),
        useValue: mockOrganisationsRepository
      }, {
        provide: getRepositoryToken(Contact),
        useValue: mockContactsRepository
      }, {
        provide: UsersService,
        useValue: mockUsersService
      }, {
        provide: MailService,
        useValue: mockMailService
      }, {
        provide: DataSource,
        useFactory: mockDataSource
      }],
    }).compile();

    dataSource = module.get<DataSource>(DataSource)
    service = module.get<OrganisationsService>(OrganisationsService);
    organisationRepo = module.get<Repository<Organisation>>(getRepositoryToken(Organisation))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create an organisation and return it', async () => {
      const uens = []
      jest.spyOn(service, 'findAllUensOfRegisterdOrgs').mockImplementation(async() => uens)
      const dto = {
        name: 'test',
        type: OrganisationType.MANUFACTURER,
        uen: '12345678'
      }
      const expectedObject = {
        id: 1,
        contact: null,
        name: dto.name,
        type: dto.type,
        uen: dto.uen
      }
      expect(await service.create(dto)).toStrictEqual(expectedObject)
    })
    it('should throw an exception if the uen is already used', async() => {
      const uens = ['12345678']
      jest.spyOn(service, 'findAllUensOfRegisterdOrgs').mockImplementation(async() => uens)
      const dto = {
        name: 'test',
        type: OrganisationType.MANUFACTURER,
        uen: '12345678'
      }
      await service.create(dto).catch(error => {
        expect(error.message).toBe('UEN is used by an exisiting registed organisation!')
      })
    })
  })

  describe('registerOrganisationAndUser', () => {
    it('transaction is used with same number of create and saves', async() => {
      const orgDto = {
        name: 'test',
        type: OrganisationType.MANUFACTURER,
        uen: '12345678'
      }
      const userDto = {
        firstName: 'testUser',
        lastName: 'testUser',
        username: 'username',
        role: Role.ADMIN,
        contact: {
          email: 'test',
          postalCode: 'test',
          phoneNumber: 'test',
          address: 'test'
        }
      }
      const uens = []
      const returnedOrganisation = new Organisation
      jest.spyOn(service, 'findAllUensOfRegisterdOrgs').mockImplementation(async() => uens)
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(returnedOrganisation))

      const mockedTransactionalEntityManager = {
        create: jest.fn().mockImplementation(() => {
          return {}
        }),
        save: jest.fn()
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      await service.registerOrganisationAndUser(orgDto, userDto)
      expect(mockedTransactionalEntityManager.save).toHaveBeenCalledTimes(3)
      expect(mockedTransactionalEntityManager.create).toHaveBeenCalledTimes(3)
      expect(dataSource.manager.transaction).toHaveBeenCalled()
    })
    it('should throw an exception when UEN is not unique', async() => {
      const orgDto = {
        name: 'test',
        type: OrganisationType.MANUFACTURER,
        uen: '12345678'
      }
      const userDto = {
        firstName: 'testUser',
        lastName: 'testUser',
        username: 'username',
        role: Role.ADMIN,
        contact: {
          email: 'test',
          postalCode: 'test',
          phoneNumber: 'test',
          address: 'test'
        }
      }
      const uens = ['12345678']
      const returnedOrganisation = new Organisation
      jest.spyOn(service, 'findAllUensOfRegisterdOrgs').mockImplementation(async() => uens)
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(returnedOrganisation))

      const mockedTransactionalEntityManager = {
        create: jest.fn().mockImplementation(() => {
          return {}
        }),
        save: jest.fn()
      }
      dataSource.manager.transaction.mockImplementation(async(cb) => {
        await cb(mockedTransactionalEntityManager)
      })
      await service.registerOrganisationAndUser(orgDto, userDto).catch(error => {
        expect(error.message).toBe('UEN is used by an exisiting registed organisation!')
      })
    })
  })
  describe('findAll', () => {
    it('should return all organisations', async() => {
      const expectedOrganisations = [
        {...testOrganisation}
      ]
      expect(await service.findAll()).toStrictEqual(expectedOrganisations)
    })
  })
  describe('findOne', () => {
    it('should return organisation if present', async() => {
      expect(await service.findOne(1)).toStrictEqual(testOrganisation)
    })
    it('should throw exception if no organisation with id is found', async() => {
      const repoSpy = jest.spyOn(organisationRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.findOne(1)).rejects.toEqual(new NotFoundException('findOne failed as Organization with id: 1 cannot be found'))
    })
  })

  describe('findOrganisationsThatMatchesShellOrgUEN', () => {
    it('should return matching organisations with matching UEN', async() => {
      const dto: any = {
        shellOrganisations: shellOrganisationsWithMatch
      }
      //finds an organisation that matches the UEN
      expect(await service.findOrganisationsThatMatchesShellOrgUEN(dto)).toStrictEqual([testOrganisation])
    })
  })

  describe('update', () => {
    it('should return the updated organisation', async() => {
      const newOrg = await service.update(1, {name: 'testUpdate'})
      expect(newOrg).toStrictEqual({
        ...testOrganisation,
        name: 'testUpdate'
      })
    })
    it('should throw an exception if no organisation is found', () => {
      const repoSpy = jest.spyOn(organisationRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.update(1, {name: 'testUpdate'})).rejects.toEqual(new NotFoundException('update Failed as Organization with id: 1 cannot be found'))
    })
  })

  describe('findOrganisationWorkers', () => {
    it('should return the users of an organisation', async() => {
      const expectedUsers = [
        {
          id: 2,
          name: 'testUser'
        }
      ]
      jest.spyOn(organisationRepo, 'findOne').mockImplementation(() => Promise.resolve({
        id: 1,
        name: 'test',
        users: [
          {
            id: 2,
            name: 'testUser'
          }
        ]
      }))

      expect(await service.findOrganisationWorkers(1)).toStrictEqual(expectedUsers)
    })
  })

  describe('remove', () => {
    it('return the removed organisation', async() => {
      expect(await service.remove(1)).toEqual(testOrganisation)
    })
    it('should throw an exception if no organisation found', () => {
      const repoSpy = jest.spyOn(organisationRepo, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(service.remove(1)).rejects.toEqual(new NotFoundException('Remove failed as Organization with id: 1 cannot be found'))
    })
  })

  describe('findOrganisationByType', () => {
    it('return organisations that matches the type', async() => {
      expect(await service.findOrganisationByType(OrganisationType.MANUFACTURER)).toStrictEqual(testOrganisation)
    })
  })

  describe('findAllUensOfRegisteredOrgs', () => {
    it('should return uens of registered organisations', async() => {
      const expectedUenArray = ['12345678']
      expect(await service.findAllUensOfRegisterdOrgs()).toStrictEqual(expectedUenArray)
    })
  })

  describe('updateOrganisationContact', () => {
    it('should return the new contact after update', async() => {
      const repoSpy = jest.spyOn(organisationRepo, 'findOne').mockResolvedValue({
        ...testOrganisation,
        contact: {
          id: 1
        }
      })
      const organisation = new Organisation
      const dto = {
        address: 'testAddress',
        phoneNumber: '98765432',
        postalCode: '123456',
        email: 'test@gmail.com,'
      }
      const expectedContact = {
        id: 1,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
        postalCode: dto.postalCode,
        email: dto.email
      }
      expect(await service.updateOrganisationContact(dto, organisation)).toStrictEqual(expectedContact)
    })
  })

  describe('directUpdate', () => {
    it('should return the updated organisation', async() => {
      const organisation: any = {
        ...testOrganisation,
        name: 'newName'
      }
      const expected = {
        id: 1,
        ...testOrganisation,
        name: 'newName'
      }
      expect(await service.directUpdate(organisation)).toStrictEqual(expected)
    })
    
  })


  
  
});
