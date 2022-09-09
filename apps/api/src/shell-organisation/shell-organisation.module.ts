import { Module } from '@nestjs/common';
import { ShellOrganisationService } from './shell-organisation.service';
import { ShellOrganisationController } from './shell-organisation.controller';

@Module({
  controllers: [ShellOrganisationController],
  providers: [ShellOrganisationService],
})
export class ShellOrganisationModule {}
