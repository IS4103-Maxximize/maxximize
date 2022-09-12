import { Test, TestingModule } from '@nestjs/testing';
import { ShellOrganisationsService } from './shell-organisations.service';

describe('ShellOrganisationsService', () => {
  let service: ShellOrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShellOrganisationsService],
    }).compile();

    service = module.get<ShellOrganisationsService>(ShellOrganisationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
