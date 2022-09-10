import { Test, TestingModule } from '@nestjs/testing';
import { ShellOrganisationsController } from './shell-organisations.controller';
import { ShellOrganisationsService } from './shell-organisations.service';

describe('ShellOrganisationsController', () => {
  let controller: ShellOrganisationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShellOrganisationsController],
      providers: [ShellOrganisationsService],
    }).compile();

    controller = module.get<ShellOrganisationsController>(ShellOrganisationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
