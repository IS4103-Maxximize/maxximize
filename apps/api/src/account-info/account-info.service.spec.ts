import { Test, TestingModule } from '@nestjs/testing';
import { AccountInfoService } from './account-info.service';

describe('AccountInfoService', () => {
  let service: AccountInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountInfoService],
    }).compile();

    service = module.get<AccountInfoService>(AccountInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
