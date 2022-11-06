import { forwardRef, Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), forwardRef(() => OrganisationsModule)],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService]
})
export class MembershipsModule {}
