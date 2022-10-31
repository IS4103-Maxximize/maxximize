import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService; 
  let userService

  const authenticatedUser = {
    id: 1,
    username: 'superAdmin',
    password: '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    isActive: true,
    salt: '$2b$10$f6h95DOKlOa4967NYpF4y.'
  }

  const accessToken = 'tra8d7a0123lnca8sd9sqx'

  const mockUsersService = {
    findByUsername: jest.fn().mockResolvedValue(authenticatedUser)
  }

  const mockJwtService = {
    sign: jest.fn().mockReturnValue(accessToken)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: mockUsersService
      }, {
        provide: JwtService,
        useValue: mockJwtService
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user details without actual password', async() => {
      const username = 'superAdmin'
      const password = 'password'
      const expectedReturnValue = {
        id: 1,
        username: 'superAdmin',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        isActive: true,
        salt: '$2b$10$f6h95DOKlOa4967NYpF4y.'
      }
      expect(await service.validateUser(username, password)).toStrictEqual(expectedReturnValue)
    })

    it('should throw an exception if user is not found', () => {
      const invalidUsername = 'superAdminInvalid'
      const password = 'password'
      const spy = jest.spyOn(userService, 'findByUsername').mockResolvedValue(null)
      expect(service.validateUser(invalidUsername, password)).rejects.toEqual(new NotFoundException(`Username: ${invalidUsername} cannot be found!`))
    })
  })

  describe('login', () => {
    it('should return an access Token', async() => {
      const expectedReturnValue = {
        access_token: accessToken
      }
      expect(await service.login(authenticatedUser)).toStrictEqual(expectedReturnValue)
    })
  })
})
