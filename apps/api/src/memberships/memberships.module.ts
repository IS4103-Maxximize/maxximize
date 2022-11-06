import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationsModule } from '../organisations/organisations.module';
import { Membership } from './entities/membership.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), forwardRef(() => OrganisationsModule)],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService]
})
export class MembershipsModule {}
