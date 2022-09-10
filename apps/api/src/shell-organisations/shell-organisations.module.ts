import { Module } from '@nestjs/common';
import { ShellOrganisationsService } from './shell-organisations.service';
import { ShellOrganisationsController } from './shell-organisations.controller';

@Module({
  controllers: [ShellOrganisationsController],
  providers: [ShellOrganisationsService]
})
export class ShellOrganisationsModule {}
