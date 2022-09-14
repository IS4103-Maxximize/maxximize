import { Module } from '@nestjs/common';
import { ShellOrganisationsService } from './shell-organisations.service';
import { ShellOrganisationsController } from './shell-organisations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';
import { ShellOrganisation } from './entities/shell-organisation.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, ShellOrganisation, Contact, Quotation, SalesInquiry, RawMaterial])],
  controllers: [ShellOrganisationsController],
  providers: [ShellOrganisationsService],
  exports: [ShellOrganisationsService]
})
export class ShellOrganisationsModule {}
