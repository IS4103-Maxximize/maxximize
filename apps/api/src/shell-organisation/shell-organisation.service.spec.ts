import { Test, TestingModule } from '@nestjs/testing';
import { ShellOrganisationService } from './shell-organisation.service';

describe('ShellOrganisationService', () => {
  let service: ShellOrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShellOrganisationService],
    }).compile();

    service = module.get<ShellOrganisationService>(ShellOrganisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
