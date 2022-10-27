import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersController: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should return an array of users', async () => {
    const result = [];
    jest.spyOn(service, 'findAll').mockImplementation(async () => result);
    expect(service).toBeDefined();
    expect(await usersController.findAll()).toBe(result);
  });
});
