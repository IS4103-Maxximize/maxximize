import { Test, TestingModule } from '@nestjs/testing';
import { AccountInfoController } from './account-info.controller';
import { AccountInfoService } from './account-info.service';

describe('AccountInfoController', () => {
  let controller: AccountInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountInfoController],
      providers: [AccountInfoService],
    }).compile();

    controller = module.get<AccountInfoController>(AccountInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
