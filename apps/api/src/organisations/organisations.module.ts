import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contacts/entities/contact.entity';
import { User } from '../users/entities/user.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, User, Contact])],
  controllers: [OrganisationsController],
  providers: [OrganisationsService]
})
export class OrganisationsModule {}
