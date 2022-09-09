import { Test, TestingModule } from '@nestjs/testing';
import { ShellOrganisationController } from './shell-organisation.controller';
import { ShellOrganisationService } from './shell-organisation.service';

describe('ShellOrganisationController', () => {
  let controller: ShellOrganisationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShellOrganisationController],
      providers: [ShellOrganisationService],
    }).compile();

    controller = module.get<ShellOrganisationController>(
      ShellOrganisationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
