/**
 *
 * @group unit
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';

describe('ContactsService', () => {
  let service: ContactsService;

  const testContact = {
    phoneNumber: '99998888',
    email: 'maxximizetest@gmail.com',
    address: 'address 1',
    postalCode: '112233'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactsService,{
        provide: getRepositoryToken(Contact),
        useValue: {
          create: jest.fn().mockImplementation(dto => dto),
          save: jest.fn().mockImplementation(contact => Promise.resolve({id: 1, ...contact})),
          find: jest.fn().mockImplementation(() => {
            return [testContact]
          }),
          findOneBy: jest.fn().mockImplementation(() => {
            return testContact
          }),
          findOne: jest.fn().mockImplementation(() => {
            return testContact
          }),
          delete: jest.fn().mockResolvedValue(testContact),
        }
      }],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('it should return a contact entity', async () => {
      const dto = {
        phoneNumber: '99998888',
        email: 'maxximizetest@gmail.com',
        address: 'address 1',
        postalCode: '112233'
      };
      const expected = {
        id: 1,
        ...dto
      }
      expect(await service.create(dto)).toStrictEqual(expected);
    })
  });

  describe('findAll', () => {
    it('should return all contacts', async() => {
      const expected = [testContact]
      expect(await service.findAll()).toStrictEqual(expected)
    })
  });

  describe('findOne', () => {
    it('should return contact if present', async() => {
      expect(await service.findOne(1)).toStrictEqual(testContact)
    })
  });

  describe('update', () => {
    it('should return the updated contact', async() => {
      const updatedContact = await service.update(1, {
        address: 'address 1 updated'
      });
      expect(updatedContact).toStrictEqual({
        ...testContact,
        address: 'address 1 updated',
        id: 1
      })
    })
  });

  describe('remove', () => {
    it('return undefined', async() => {
      expect(await service.remove(1)).toEqual(undefined);
    })
  });

  describe('findByPhoneNumber', () => {
    it('should return contact if contact with phoneNumber is present', async() => {
      expect(await service.findByPhoneNumber("99998888")).toStrictEqual(testContact)
    })
  });
});
